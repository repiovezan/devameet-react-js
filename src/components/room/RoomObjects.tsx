import enterRoomIcon from "../../assets/images/enterRoom.svg";
import { useEffect, useState } from "react";
import micOnIcon from '../../assets/images/micOn.svg';
import micOffIcon from '../../assets/images/micOff.svg';



type RoomObjectsProps = {
  objects: Array<any>;
  connectedUsers?: Array<any>;
  me?: any;
  enterRoom(): void;
  toggleMute?(): void;
};

export const RoomObjects: React.FC<RoomObjectsProps> = ({
  objects,
  enterRoom,
  connectedUsers,
  me,
  toggleMute
}) => {
  const [objectsWithWidth, setObjectsWithWidth] = useState<Array<any>>([]);
  const mobile = window.innerWidth <= 992;

  const getImageFromObject = (object: any, isAvatar: boolean) => {
    if (object && object._id) {
      const path = `../../assets/objects/${
        isAvatar ? "avatar" : object?.type
      }/${isAvatar ? object.avatar : object?.name}${
        object.orientation ? "_" + object.orientation : ""
      }.png`;
      const imgUrl = new URL(path, import.meta.url);

      if (mobile) {
        let image = new Image();
        image.onload = () => {
          const exist = objectsWithWidth.find(
            (o: any) => o.name == object.name
          );
          if (!exist) {
            const newObjects = [
              ...objectsWithWidth,
              { name: object.name, width: image.width },
            ];
            setObjectsWithWidth(newObjects);
          }
        };
        image.src = imgUrl.href;
      }

      return imgUrl.href;
    }
  };

  const getClassFromObject = (object: any) => {
    let style = "";

    switch (object.y) {
      case 0: {
        style += " row-zero";
        break;
      }
      case 1: {
        style += " row-one";
        break;
      }
      case 2: {
        style += " row-two";
        break;
      }
      case 3: {
        style += " row-three";
        break;
      }
      case 4: {
        style += " row-four";
        break;
      }
      case 5: {
        style += " row-five";
        break;
      }
      case 6: {
        style += " row-six";
        break;
      }
      case 7: {
        style += "row-seven";
        break;
      }

      default:
        break;
    }

    switch (object.x) {
      case 0: {
        style += " column-zero";
        break;
      }
      case 1: {
        style += " column-one";
        break;
      }
      case 2: {
        style += " column-two";
        break;
      }
      case 3: {
        style += " column-three";
        break;
      }
      case 4: {
        style += " column-four";
        break;
      }
      case 5: {
        style += " column-five";
        break;
      }
      case 6: {
        style += " column-six";
        break;
      }
      case 7: {
        style += " column-seven";
        break;
      }

      default:
        break;
    }

    switch (object.zIndex) {
      case 0: {
        style += " zIndex-0";
        break;
      }
      case 1: {
        style += " zIndex-1";
        break;
      }
      case 2: {
        style += " zIndex-2";
        break;
      }
      case 3: {
        style += " zIndex-3";
        break;
      }

      default:
        break;
    }

    return style;
  };

  const getObjectStyle = (object: any) => {
    let style = {} as any;
    if (mobile) {
      const obj = objectsWithWidth.find((o: any) => o.name == object.name);
      if (obj) {
        const width = obj.width * 0.5;
        style.width = width + "px";
      }
    }
    return style;
  };

  const getName = (user: any) => {
    if (user?.name) {
      return user.name.split(" ")[0];
    }
    return "";
  };

  const getMutedClass = (user: any) => {
    if (user?.muted) {
      return 'muted';
    }
    return "";
  }
  return (
    <div className="container-grid">
      <div className="center">
        <div className="grid">
          {objects?.map((object: any) => (
            <img
              key={object._id}
              src={getImageFromObject(object, false)}
              className={getClassFromObject(object)}
              style={getObjectStyle(object)}
            />
          ))}
          {connectedUsers?.map((user: any) => (
            <div
              className={"user-avatar " + getClassFromObject(user)}
              key={user._id}
            >
              <div className={getMutedClass(user)}>
                <span className={getMutedClass(user)}>{getName(user)}</span>
              </div>
              <img
                src={getImageFromObject(user, true)}
                style={getObjectStyle(user)}
                alt="avatar"
              />
            </div>
          ))}
          {
            (me?.user && me.muted) && 
            <img src={micOffIcon} className="audio" onClick={toggleMute}/>
          }
          {
            (me?.user && !me.muted) && 
            <img src={micOnIcon} className="audio" onClick={toggleMute}/>
          }
          {(!connectedUsers || connectedUsers?.length === 0) && (
            <div className="preview">
              <img src={enterRoomIcon} alt="entrar na sala" />
              <button onClick={enterRoom}>Entrar na Sala</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
