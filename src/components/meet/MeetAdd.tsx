import { MeetEditHeader } from "./MeetEditHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MeetServices } from "../../services/MeetServices";
import { MeetObjectsRoom } from "./MeetObjectsRoom";

const meetService = new MeetServices();

export const MeetAdd = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [color, setColor] = useState("");

  const goBack = () => {
    return navigate(-1);
  };

  const isFormInvalid =
    !name || name.trim().length < 5 || !color || color.trim().length < 4;

  const doSave = async () => {
    try {
      if (isFormInvalid) {
        return;
      }

      await meetService.createMeet({ name, color });
      return goBack();
    } catch (error: any) {
      if (error?.response.data?.message) {
        console.log(
          "Houve um erro ao criar a reunião: ",
          error?.response.data?.messag
        );
      } else {
        console.log("Houve um erro ao criar a reunião: ", error);
      }
    }
  };

  return (
    <div className="container-principal">
      <div className="container-meet">
        <MeetEditHeader
          color={color}
          name={name}
          setColor={setColor}
          setName={setName}
          isEdit={false}
        />
        <div className="form">
          <span onClick={goBack}>Voltar</span>
          <button
            onClick={doSave}
            disabled={isFormInvalid}
            className={isFormInvalid ? "disabled" : ""}
          >
            Salvar
          </button>
        </div>
      </div>
      <MeetObjectsRoom />
    </div>
  );
};
