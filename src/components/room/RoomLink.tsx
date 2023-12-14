import { PublicInput } from "../general/PublicInput";
import { MeetUserHeader } from "../meet/MeetUserHeader";
import linkIcon from '../../assets/images/link.svg';
import {useState} from 'react';
import { useNavigate } from "react-router-dom";

export const RoomLink = () => {
  const navigate = useNavigate();

  const [link, setLink] = useState('');
  const [error, setError] = useState('');


  const navigateToRoom = () => {
    if(link && link.length >= 8){
      return navigate('/room/' + link);
    }
    setError('Link inválido, por favor verifique')
  }

  return (
    <div className="container-principal">
      <div className="container-meet link">
        <MeetUserHeader isLink={true}/>
        {error && <p className="error">{error}</p>}
        <PublicInput icon={linkIcon} type="text" name="Informe o link da reunião para entrar" alt="link" modelValue={link} setValue={setLink}/>
        <button onClick={navigateToRoom}>Entrar</button>
      </div>
    </div>
  );
};
