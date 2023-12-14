import { useLocation, useNavigate } from "react-router-dom";
import homeGrey from "../../assets/images/homeGrey.svg";
import homeBlue from "../../assets/images/homeBlue.svg";
import doorGrey from "../../assets/images/doorGrey.svg";
import doorBlue from "../../assets/images/doorBlue.svg";
import avatarIcon from "../../assets/images/avatar.svg";


export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mobile = window.innerWidth <= 992;

  const avatarImage = () => {
    const avatar = localStorage.getItem('avatar');
    if(avatar){
      const path = `../../assets/objects/avatar/${avatar}_front.png`;
      const imageUrl = new URL(path, import.meta.url);
      return imageUrl.href;
    };
    return avatarIcon;
  }

  const getIcon = (name: string) => {
    switch (name) {
      case 'home':
        if(location.pathname !== '/user' && location.pathname !== '/link' && !location.pathname.includes('/room')){
          return homeBlue;
        }
        return homeGrey;      
      case 'room':
        if(location.pathname.includes('/room') || location.pathname === '/link'){
          return doorBlue;
        }
        return doorGrey;      
    
      default:
        return "";
    }
  };



  const getSelectedClass = () => {
    if(location.pathname === '/user'){
      return 'selected';
    }
    return '';
  }
  return (
    <div className="container-navigation">
          <ul>
            <li>
              <img
                src={getIcon('home')}
                alt="home"
                className="iconNav"
                onClick={() => navigate("/")}
              />
            </li>
            {mobile ? 
              <li>
                <img
                  src={getIcon('room')}
                  alt="Entrar na reunião"
                  className="iconNav"
                  onClick={() => navigate("/link")}
                />
              </li>
              :
              <li className="disabled">
                <img
                  src={getIcon('room')}
                  alt="Entrar na reunião"
                  className="iconNav"                  
                />
              </li>
            }
            <li>
              <div className={"avatar mini " + getSelectedClass()}>
                <img src={avatarImage()} alt="Editar usuário" onClick={() => navigate("/user")} />
              </div>
            </li>
          </ul>
        </div>
  )
}