import logo from "../assets/images/logo.svg";
import mail from "../assets/images/mail.svg";
import key from "../assets/images/key.svg";
import { PublicInput } from "../components/general/PublicInput";
import { useContext ,useState } from "react";
import { LoginServices } from "../services/LoginService";
import { Link, useSearchParams } from "react-router-dom";
import { AuthorizeContext } from "../App";

const loginServices = new LoginServices();

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');

  const {setToken} = useContext(AuthorizeContext)

  const doLogin = async () => {
    try {
      setError("");

      if (
        !login ||
        login.trim().length < 5 ||
        !password ||
        password.trim().length < 4
      ) {
        return setError("Favor preencher os campos corretamente");
      }

      setLoading(true);

      await loginServices.login({ login, password }, setToken);
      setLoading(false);
      
    } catch (error: any) {
      console.log("Erro ao efetuar o login:", error);
      setLoading(false);
      if (error?.response?.data?.message) {
        return setError(error?.response?.data?.message);
      }
      return setError("Erro ao efetuar login, tente novamente");
    }
  };

  return (
    <div className="container-public">
      <img src={logo} alt="logo devameet" className="logo" />
      <form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Cadastro efetuado com sucesso, faça seu login</p>}
        <PublicInput
          icon={mail}
          alt="Email"
          name="Email"
          type="text"
          modelValue={login}
          setValue={setLogin}
        />
        <PublicInput
          icon={key}
          alt="Senha"
          name="Senha"
          type="password"
          modelValue={password}
          setValue={setPassword}
        />

        <button type="button" onClick={doLogin} disabled={loading}>
          {loading ? "...Carregando" : "Login"}
        </button>
        <div className="link">
          <p>Não possui uma conta?</p>
          <Link to="/register">Faça seu cadastro agora!</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
