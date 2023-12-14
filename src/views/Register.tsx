import logo from "../assets/images/logo.svg";
import mail from "../assets/images/mail.svg";
import key from "../assets/images/key.svg";
import user from "../assets/images/user.svg";
import { PublicInput } from "../components/general/PublicInput";
import { useState } from "react";
import { RegisterService } from "../services/RegisterService";
import { Link, useNavigate } from "react-router-dom";
import { AvatarInput } from "../components/general/AvatarInput";

const registerService = new RegisterService();

const Register = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const navigate = useNavigate()

  const doRegister = async () => {
    try {
      setError('');

      if(!image || image.trim().length < 1 || !name || name.trim().length < 2 || !email || email.trim().length < 5 || !password || password.trim().length < 4 || !confirmPassword || confirmPassword.trim().length < 4){
        return setError('Favor preencher os campos corretamente')
      };

      if(password !== confirmPassword){
        return setError('Senha e confirmação de senha devem ser iguais')
      }

      setLoading(true);

      const body = {
        name,
        email,
        password,
        avatar: image
      }

      await registerService.register(body)

      setLoading(false);

      return navigate('/?success=true')

    } catch (error: any) {
      console.log("Erro ao efetuar o cadastro:", error);
      setLoading(false);
      if (error?.response?.data?.message) {
        return setError(error?.response?.data?.message);
      }
      return setError("Erro ao efetuar login, tente novamente");
    }
  }
  
  return (
    <div className="container-public register">
      <img src={logo} alt="logo devameet" className="logo" />
      <form>
        <AvatarInput image={image} setImage={setImage}/>

        {error && <p className="error">{error}</p>}
        <PublicInput
          icon={user}
          alt="Nome Completo"
          name="Nome Completo"
          type="text"
          modelValue={name}
          setValue={setName}
        />
        <PublicInput
          icon={mail}
          alt="Email"
          name="Email"
          type="text"
          modelValue={email}
          setValue={setEmail}
        />
        <PublicInput
          icon={key}
          alt="Senha"
          name="Senha"
          type="password"
          modelValue={password}
          setValue={setPassword}
        />
        <PublicInput
          icon={key}
          alt="Confirmar Senha"
          name="Confirmar Senha"
          type="password"
          modelValue={confirmPassword}
          setValue={setConfirmPassword}
        />

        <button type="button" onClick={() => doRegister()} disabled={loading}>
          {loading ? "...Carregando" : "Cadastrar"}
        </button>
        <div className="link">
          <p>Já possui uma conta?</p>
          <Link to='/'>Faça seu login agora!</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
