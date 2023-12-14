import { useState, useEffect } from "react";
import { MeetEditHeader } from "./MeetEditHeader";
import { MeetObjectPicker } from "./MeetObjectPicker";
import wallIcon from "../../assets/images/wall.svg";
import floorIcon from "../../assets/images/floor.svg";
import rugIcon from "../../assets/images/rug.svg";
import tableIcon from "../../assets/images/table.svg";
import chairIcon from "../../assets/images/chair.svg";
import couchIcon from "../../assets/images/couch.svg";
import decorIcon from "../../assets/images/decoration.svg";
import natureIcon from "../../assets/images/plant.svg";
import objectJSON from "../../assets/objects/objects.json";
import { MeetObjectsRoom } from "./MeetObjectsRoom";
import { useNavigate, useParams } from "react-router-dom";
import { MeetServices } from "../../services/MeetServices";

const meetService = new MeetServices();

export const MeetEdit = () => {
  const [index, setIndex] = useState(0);
  const [id, setId] = useState('');
  const [color, setColor] = useState("");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<any>({});
  const [objects, setObjects] = useState<any>([]);

  const isFormInvalid = !id || id.trim().length < 5 ||!name || name.trim().length < 5 || !color || color.trim().length < 4;

  const navigate = useNavigate()

  const {meetId} = useParams();

  const getMeet = async () => {
    if(!meetId){
      return navigate('/');
    };
    
    const result = await meetService.getMeetById(meetId);
    
    if(!result?.data){
      return navigate('/');
    }
    
    const {_id, name, color} = result.data;

    setId(_id);
    setName(name);
    setColor(color);

    const objectsResult = await meetService.getMeetObjectsById(meetId);
    
    if(objectsResult?.data){
      const newObjects = objectsResult?.data?.map((o: any) => {
        return {...o, type: o?.name?.split('_')[0]}
      });
      setObjects(newObjects);
    }
    console.log(objects)

  }

  useEffect(() => {
    getMeet();
  },[])


  const setObject = (object: any) => {
    const newIndex = index + 1;
    object._id = newIndex;
    setIndex(newIndex);

    if (object.selectMultiple === true) {
      const newArray = [...objects, object];
      setObjects(newArray);
    } else {
      const filtered = objects.filter((o: any) => o.type !== object.type);
      filtered.push(object);
      setObjects(filtered);
    }

    setSelected(object);
  };

  const removeObject = (object: any) => {
    const filtered = objects.filter((o: any) => o._id !== object._id);
    setObjects(filtered);
    setSelected(null);
  };

  const rotateObject = (object: any, to: string) => {
    if (object?._id && (object?.type === "chair" || object?.type === "couch")) {
      const index = objects?.indexOf(object);
      if (to === "left") {
        switch (object.orientation) {
          case "left": {
            object.orientation = "front";
            break;
          }
          case "front": {
            object.orientation = "right";
            break;
          }
          case "right": {
            object.orientation = "back";
            break;
          }
          case "back": {
            object.orientation = "left";
            break;
          }
          default:
            break;
        }
      } else if (to === "right") {
        switch (object.orientation) {
          case "left": {
            object.orientation = "back";
            break;
          }
          case "back": {
            object.orientation = "right";
            break;
          }
          case "right": {
            object.orientation = "front";
            break;
          }
          case "front": {
            object.orientation = "left";
            break;
          }
          default:
            break;
        }
      }
      setSelected(object);
      objects[index] = object;
      const newArray = [...objects];
      setObjects(newArray);
    }
  };

  const moveSelected = (event: any, selected: any) => {
    if(selected && selected._id && selected.type !== 'floor' && selected.type !== 'wall'){
      const index = objects?.indexOf(selected);

      switch (event?.key) {
        case "ArrowUp": {
          selected.y = selected.y > 1 ? selected.y - 1 : 1;
          break;
        }
        case "ArrowDown": {
          selected.y = selected.y < 6 ? selected.y + 1 : 6;
          break;
        }
        case "ArrowLeft": {
          selected.x = selected.x > 0 ? selected.x - 1 : 0;
          break;
        }
        case "ArrowRight": {
          selected.x = selected.x < 7 ? selected.x + 1 : 7;
          break;
        }
  
        default:
          break;
      }
      setSelected(selected);
      objects[index] = selected;
      const newArray = [...objects];
      setObjects(newArray);

    }
  };

  const goBack = () => {
    return navigate(-1);
  };

  const doUpdate = async () => {
    try {
      if (isFormInvalid) {
        return;
      }

      const body = {
        name,
        color,
        objects
      }

      await meetService.updateMeet(body, id);
      return navigate('/');
    } catch (error: any) {
      if (error?.response.data?.message) {
        console.log(
          "Houve um erro ao editar a reunião: ",
          error?.response.data?.messag
        );
      } else {
        console.log("Houve um erro ao editar a reunião: ", error);
      }
    }
  }

  return (
    <div className="container-principal">
      <div className="container-meet">
        <MeetEditHeader
          color={color}
          setColor={setColor}
          name={name}
          setName={setName}
          isEdit={true}
        />
        <div className="scroll">
          <MeetObjectPicker
            asset={objectJSON.wall}
            image={wallIcon}
            label="Paredes"
            selected={selected?.name}
            setObject={setObject}
          />
          <MeetObjectPicker
            asset={objectJSON.floor}
            image={floorIcon}
            label="Pisos"
            selected={selected?.name}
            setObject={setObject}
          />
          <MeetObjectPicker
            asset={objectJSON.rug}
            image={rugIcon}
            label="Tapetes"
            selected={selected?.name}
            setObject={setObject}
          />
          <MeetObjectPicker
            asset={objectJSON.table}
            image={tableIcon}
            label="Mesas"
            selected={selected?.name}
            setObject={setObject}
          />
          <MeetObjectPicker
            asset={objectJSON.chair}
            image={chairIcon}
            label="Cadeiras"
            selected={selected?.name}
            setObject={setObject}
          />
          <MeetObjectPicker
            asset={objectJSON.couch}
            image={couchIcon}
            label="Sofás"
            selected={selected?.name}
            setObject={setObject}
          />
          <MeetObjectPicker
            asset={objectJSON.decor}
            image={decorIcon}
            label="Decorações"
            selected={selected?.name}
            setObject={setObject}
          />
          <MeetObjectPicker
            asset={objectJSON.nature}
            image={natureIcon}
            label="Plantas"
            selected={selected?.name}
            setObject={setObject}
          />
        </div>
        <div className="form">
          <span onClick={goBack}>Voltar</span>
          <button 
            className={isFormInvalid ? "disabled" : ""}
            disabled={isFormInvalid}
            onClick={doUpdate}
          >
              Salvar</button>
        </div>
      </div>
      <MeetObjectsRoom
        objects={objects}
        selected={selected}
        setSelected={setSelected}
        removeObject={removeObject}
        rotateObject={rotateObject}
        moveSelected={moveSelected}
      />
    </div>
  );
};
