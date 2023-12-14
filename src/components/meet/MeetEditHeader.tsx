import { useState } from "react";
import arrowIcon from "../../assets/images/arrowDown.svg";
import { Modal } from "react-bootstrap";

type MeetEditHeaderProps = {
  name: string;
  color: string;
  setName(s: string): void;
  setColor(s: string): void;
  isEdit: boolean;
};

export const MeetEditHeader: React.FC<MeetEditHeaderProps> = ({
  color,
  name,
  setColor,
  setName,
  isEdit
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const colors = [
    "#B0A4FF",
    "#5E49FF",
    "#3BD42D",
    "#25CBD3",
    "#1D70E0",
    "#1D9AA1",
    "#D4B811",
    "#D46B26",
  ];

  const cancelSelection = () => {
    setShowModal(false);
    setSelected(null);
  };

  const selectColor = () => {
    if(selected){
      setColor(selected);
    }

    setShowModal(false);
  };

  return (
    <>
      <div className="container-user-header">
        <span>{isEdit ? 'Editar reunião' : 'Nova reunião'}</span>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome de sua reunião"
          />
          <div className="color-select" onClick={() => setShowModal(true)}>
            <div
              className="circle"
              style={color ? { backgroundColor: color } : {}}
            />
            <img src={arrowIcon} alt="Selecionar Cor" />
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="container-modal"
      >
        <Modal.Body>
          <div className="content">
            <div className="container">
              <span>Selecione a cor da reunião</span>
              <div className="colors">
                {colors.map((c) => (
                  <div
                    key={c}
                    className={c === selected ? 'selected' : ''}
                    onClick={() => setSelected(c)}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="actions">
              <span onClick={cancelSelection}>Cancelar</span>
              <button onClick={selectColor}>Confirmar</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
