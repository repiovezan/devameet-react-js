import logo from "../../assets/images/logo.svg";
import { Navigation } from "./Navigation";


export const Header = () => {

  

  return (
    <>
      <div className="container-header">
        <img src={logo} alt="Logo" className="logo" />
        <Navigation />
      </div>
    </>
  );
};
