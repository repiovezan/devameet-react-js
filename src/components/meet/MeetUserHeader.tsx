import { useNavigate } from 'react-router-dom';
import addIcon from '../../assets/images/plusSquare.svg'

type MeetUserHeaderProps = {
  isLink?: boolean
}

export const MeetUserHeader: React.FC<MeetUserHeaderProps> = ({isLink}) => {
  const navigate = useNavigate();

  const name = localStorage.getItem('name') || '';

  const mobile = window.innerWidth <= 992;
  const navigateToAdd = () => {
    navigate('/add');
  }
  return (
    <div className="container-user-header">
      <span>{isLink? 'Reunião' :  'Minhas reuniões'}</span>

      <div>
        <p>Olá, {name}</p>
        {!mobile && 
        <img src={addIcon} alt="Adicionar Reunião" onClick={navigateToAdd}/>
        }
      </div>
    </div>
  );
};
