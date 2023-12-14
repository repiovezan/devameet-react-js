import doorIcon from "../../assets/images/doorMeet.svg";
import copyIcon from "../../assets/images/copy.svg";
import deleteIcon from "../../assets/images/delete.svg";
import editIcon from "../../assets/images/edit.svg";
import { useNavigate } from "react-router-dom";


type MeetListItemProps ={
  meet: any,
  selectMeet(meet: any):void,
  selected: string,
  selectToRomove(id: string):void,

}

export const MeetListItem: React.FC<MeetListItemProps> = ({meet, selectToRomove, selectMeet, selected}) => {
  const navigate = useNavigate();

  const mobile = window.innerWidth <= 992;

  const goToRoom = () => {
    navigate('room/' + meet?.link);
  }
  const goToEdit = () => {
    navigate('edit/' + meet?.id);
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window?.location.href + 'room/' + meet?.link)
  }

  return (
    <div className="container-meet-list-item">
      <div className="meet" onClick={() => {!mobile ? selectMeet(meet) : null}}>
        <div className="color" style={{backgroundColor: meet.color}}/>
        <span className={selected === meet?.id ? 'selected' : ''}>{meet?.name}</span>
      </div>
      <div className="actions">
        {mobile && <img src={doorIcon} alt="Entrar na reunião" onClick={goToRoom}/>}
        <img src={copyIcon} alt="Copiar link da reunião" onClick={copyLink}/>
        {!mobile && <img src={editIcon} alt="Editar reunião" onClick={goToEdit}/>}
        <img src={deleteIcon} alt="deletar reunião" onClick={() => selectToRomove(meet?.id)}/>
      </div>
    </div>
  );
};
