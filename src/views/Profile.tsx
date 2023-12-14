import { ActionHeader } from "../components/general/ActionHeader";
import { AvatarInput } from "../components/general/AvatarInput";
import { Footer } from "../components/general/Footer";
import { Header } from "../components/general/Header";
import { useContext, useState } from "react";
import clearIcon from "../assets/images/clear.svg";
import logoutIcon from "../assets/images/logout.svg";
import { LoginServices } from "../services/LoginService";
import { useNavigate } from "react-router-dom";
import { AuthorizeContext } from "../App";
import { UserServices } from "../services/UserServices";

const loginServices = new LoginServices();
const userServices = new UserServices();

export const Profile = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthorizeContext);

  const [image, setImage] = useState(localStorage.getItem("avatar") || "");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const mobile = window.innerWidth <= 992;

  const finishUpdate = async () => {
    try {
      if (!name || name.trim().length < 2) {
        return;
      }
      const body = { name } as any;

      if (image) {
        body.avatar = image;
      }

      await userServices.update(body);

      localStorage.setItem('name', name);
      if (image) {
        localStorage.setItem('avatar', image);        
      }

      return navigate(-1)

    } catch (error: any) {
      if (error?.response?.data?.message) {
        console.log(
          "Ocorreu um erro ao atualizar o usuário: ",
          error?.response?.data?.message
        );
      } else {
        console.log("Ocorreu um erro ao atualizar o usuário: ", error);
      }
    }
  };

  const logout = () => {
    loginServices.logout(setToken);
    navigate("/");
  };

  return (
    <>
      {!mobile && <Header />}
      <div className="container-profile">
        <ActionHeader actionCallback={finishUpdate} disabled={!name}/>
        <AvatarInput image={image} setImage={setImage} />
        <div className="line" />
        <div className="input">
          <span>Nome</span>
          <input
            type="text"
            placeholder="Informe seu nome"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {name && (
            <img
              src={clearIcon}
              alt="Limpar campo"
              onClick={() => setName("")}
            />
          )}
        </div>
        <div className="logout">
          <div onClick={logout}>
            <img src={logoutIcon} alt="Logout" />
            <span>Sair</span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
