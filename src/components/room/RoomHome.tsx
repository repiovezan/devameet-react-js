import { useEffect, useState } from "react";
import emptyIcon from "../../assets/images/emptyList.svg";
import { useNavigate, useParams } from "react-router-dom";
import copyIcon from "../../assets/images/copy.svg";
import { RoomObjects } from "./RoomObjects";
import { RoomServices } from "../../services/RoomServices";
import { createPeerConnectionContext } from "../../services/WebSocketServices";
import arrowUpIcon from "../../assets/images/arrowUpMove.svg";
import arrowLeftIcon from "../../assets/images/arrowLeftMove.svg";
import arrowRightIcon from "../../assets/images/arrowRightMove.svg";
import arrowDownIcon from "../../assets/images/arrowDownMove.svg";
import { Modal } from "react-bootstrap";

const roomServices = new RoomServices();
const wsServices = createPeerConnectionContext();

let userMediaStream: any;

export const RoomHome = () => {
  const navigate = useNavigate();
  const [objects, setObjects] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [me, setMe] = useState<any>({});
  const [color, setColor] = useState("");
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cantWalk, setCantWalk] = useState<any>([]);

  const { link } = useParams();

  const userId = localStorage.getItem("id") || "";

  const mobile = window.innerWidth <= 992;

  useEffect(() => {
    getRoom();
  }, []);
  useEffect(() => {
    document.addEventListener("keyup", (event: any) => doMovement(event));

    return () => {
      document.removeEventListener("keyup", (event: any) => doMovement(event));
    };
  }, [cantWalk]);

  const getRoom = async () => {
    try {
      if (!link) {
        return navigate("/");
      }

      const result = await roomServices.getRoomByLink(link);

      if (!result || !result.data) {
        return;
      }

      const { color, name, objects } = result.data;

      setName(name);
      setColor(color);

      const newObjects = objects.map((o: any) => {
        return { ...o, type: o?.name?.split("_")[0] };
      });

      setObjects(newObjects);

      userMediaStream = await navigator?.mediaDevices?.getUserMedia({
        video: {
          width: { min: 640, ideal: 1280 },
          height: { min: 400, ideal: 1080 },
          aspectRatio: { ideal: 1.7777 },
        },
        audio: true,
      });
      if (document.getElementById("localVideoRef")) {
        const videoRef: any = document.getElementById("localVideoRef");
        videoRef.srcObject = userMediaStream;
      }
    } catch (error) {
      console.log("Ocorreu erro ao buscar dados da sala: ", error);
    }
  };

  const cantWalkThrough = () => {
    let coordinates: any[] = [];

    objects.map((o: any) => {
      if (o.canWalkOver === false) {
        let width = o.width;
        let height = o.height;

        let y = o.y;
        let x = o.x;
        for (width; width > 0; width--) {
          for (height; height > 0; height--) {
            coordinates.push([x, y]);
            y++;
          }
          y = o.y;
          height = o.height;
          x++;
        }
      }
    });
    setCantWalk([coordinates]);
  };

  const enterRoom = () => {
    if (!userMediaStream) {
      return setShowModal(true);
    }
    if (!link || !userId) {
      return navigate("/");
    }
    wsServices.joinRoom(link, userId);
    wsServices.onCallMade();
    wsServices.onUpdateUserList(async (users: any) => {
      if (users) {
        setConnectedUsers(users);
        localStorage.setItem("connectedUsers", JSON.stringify(users));

        const me = users.find((u: any) => u.user === userId);
        if (me) {
          setMe(me);
          localStorage.setItem("me", JSON.stringify(me));
        }

        const usersWithoutMe = users.filter(
          (user: any) => user.user !== userId
        );

        for (const user of usersWithoutMe) {
          wsServices.addPeerConnection(
            user.clientId,
            userMediaStream,
            (_stream: any) => {
              if (document.getElementById(user.clientId)) {
                const videoRef: any = document.getElementById(user.clientId);
                videoRef.srcObject = _stream;
              }
            }
          );
        }
      }
    });
    wsServices.onRemoveUser((socketId: any) => {
      const connectedStr = localStorage.getItem("connectedUsers") || "";
      const connectedUsers = JSON.parse(connectedStr);

      const filtered = connectedUsers?.filter(
        (u: any) => u.clientId !== socketId
      );
      setConnectedUsers(filtered);
      wsServices.removePeerConnection(socketId);
    });

    wsServices.onAddUser((user: any) => {
      console.log("onAddUser", user);
      wsServices.addPeerConnection(user, userMediaStream, (_stream: any) => {
        if (document.getElementById(user)) {
          const videoRef: any = document.getElementById(user);
          videoRef.srcObject = _stream;
        }
      });

      wsServices.callUser(user);
    });

    wsServices.onAnswerMade((socket: any) => wsServices.callUser(socket));
    cantWalkThrough();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const toggleMute = () => {
    const payload = {
      userId,
      link,
      muted: !me.muted,
    };

    wsServices.updateUserMute(payload);
  };

  const doMovement = (event: any) => {
    const meStr = localStorage.getItem("me") || "";
    const user = JSON.parse(meStr);


    if (event && user) {
      const payload = {
        userId,
        link,
      } as any;

      switch (event.key) {
        case "ArrowUp": {  
          if(cantWalk[0]){
              payload.x = user.x;
              payload.orientation = "back";
              if (user.orientation === "back") {
                payload.y = user.y > 1 ? user.y - 1 : 1;
              } else {
                payload.y = user.y;
              }
              cantWalk[0].map(((o: any) => {
                if(o[0] === payload.x && o[1] === payload.y){
                  payload.x = user.x;
                  payload.y = user.y
                }
              }))
            }
            break;
          
        }

        case "ArrowDown": {
          if(cantWalk[0]){
            payload.x = user.x;
            payload.orientation = "front";
            if (user.orientation === "front") {
              payload.y = user.y < 7 ? user.y + 1 : 7;
            } else {
              payload.y = user.y;
            }
            cantWalk[0].map(((o: any) => {
              if(o[0] === payload.x && o[1] === payload.y){
                payload.x = user.x;
                payload.y = user.y
              }
            }))
          }
          break;
        }

        case "ArrowLeft": {
          if(cantWalk[0]){
          payload.y = user.y;
          payload.orientation = "left";
          if (user.orientation === "left") {
            payload.x = user.x > 0 ? user.x - 1 : 0;
          } else {
            payload.x = user.x;
          }
          console.log(cantWalk[0])
            cantWalk[0].map(((o: any) => {
              if(o[0] === payload.x && o[1] === payload.y){
                payload.x = user.x;
                payload.y = user.y
              }
            }))
          }
          break;
        }

        case "ArrowRight": {
          payload.y = user.y;
          if(cantWalk[0]){
          payload.orientation = "right";
          if (user.orientation === "right") {
            payload.x = user.x < 7 ? user.x + 1 : 7;
          } else {
            payload.x = user.x;
          }
            cantWalk[0].map(((o: any) => {
              if(o[0] === payload.x && o[1] === payload.y){
                payload.x = user.x;
                payload.y = user.y
              }
            }))
          }
          
          break;
        }

        default:
          break;
      }

      if (payload.x >= 0 && payload.y >= 0 && payload.orientation) {
        wsServices.updateUserMovement(payload);
      }
    }
  };

  const getUsersWithoutMe = () => {
    return connectedUsers.filter((user: any) => user.user !== userId);
  };

  const getName = (user: any) => {
    if (user?.name) {
      return user.name.split(" ")[0];
    }
    return "";
  };

  const getMutedClass = (user: any) => {
    if (user?.muted) {
      return "muted";
    }
    return "";
  };  

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="container-modal"
      >
        <Modal.Body>
          <div className="content">
            <div className="container">
              <span>Aviso!</span>
              <p>
                Habilite a permissão de áudio e vídeo para participar das
                reuniões
              </p>
            </div>
            <div className="actions">
              <button onClick={() => setShowModal(false)}>Ok</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="container-principal">
        <div className="container-room">
          {objects && objects.length > 0 ? (
            <>
              <div className="resume">
                <div
                  className="streams"
                >
                  {getUsersWithoutMe()?.map((user: any) => (
                    <>
                      {mobile ? (
                        <audio
                          key={user.clientId}
                          id={user.clientId}
                          playsInline
                          autoPlay
                          muted={user?.muted}
                        />
                      ) : (
                        <div className="otherUsersStreams">
                          <div className={"name " + getMutedClass(user)}>
                            <span className={getMutedClass(user)}>
                              {getName(user)}
                            </span>
                          </div>
                          <video
                            key={user.clientId}
                            id={user.clientId}
                            playsInline
                            autoPlay
                            muted={user?.muted}
                          />
                        </div>
                      )}
                    </>
                  ))}
                </div>
                {mobile ? (
                  <audio id="localVideoRef" playsInline autoPlay muted />
                ) : (
                  <div className="meStream">
                    <div className={"name " + getMutedClass(me)}>
                      <span className={getMutedClass(me)}>{getName(me)}</span>
                    </div>
                    <video id="localVideoRef" playsInline autoPlay muted />
                  </div>
                )}
                <div onClick={copyLink}>
                  <span>
                    <strong>Reunião</strong> {link}
                  </span>
                  <img src={copyIcon} alt="Copie o link da sala" />
                </div>
                <p style={{ color: color }}>{name}</p>
              </div>
              <RoomObjects
                connectedUsers={connectedUsers}
                me={me}
                objects={objects}
                enterRoom={enterRoom}
                toggleMute={toggleMute}
              />
              {mobile && me?.user && (
                <div className="movement">
                  <div
                    className="button"
                    onClick={() => doMovement({ key: "ArrowUp" })}
                  >
                    <img src={arrowUpIcon} alt="andar para cima" />
                  </div>
                  <div className="line">
                    <div
                      className="button"
                      onClick={() => doMovement({ key: "ArrowLeft" })}
                    >
                      <img src={arrowLeftIcon} alt="andar para esquerda" />
                    </div>
                    <div
                      className="button"
                      onClick={() => doMovement({ key: "ArrowDown" })}
                    >
                      <img src={arrowDownIcon} alt="andar para baixo" />
                    </div>
                    <div
                      className="button"
                      onClick={() => doMovement({ key: "ArrowRight" })}
                    >
                      <img src={arrowRightIcon} alt="andar para direita" />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty">
              <img src={emptyIcon} />
              <p>Reunião não encontrada :/</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
