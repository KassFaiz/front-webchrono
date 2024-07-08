import {
  Box,
  Button,
  CompositeZIndex,
  FixedZIndex,
  Flex,
  Layer,
  Modal,
  Tabs,
  TapArea,
  Text,
  TextField,
} from "gestalt";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { notifyError, notifySuccess } from "../utils/notify";
import { useCookies } from "react-cookie";
import { BASE_URL } from "../defaults";

export default function AuthModal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [handleSubmit, setHandleSubmit] = useState(null);

  const { closeAuthModal } = useContext(AuthContext);

  const HEADER_ZINDEX = new FixedZIndex(10);
  const zIndex = new CompositeZIndex([HEADER_ZINDEX]);

  return (
    <Layer zIndex={zIndex}>
      <Modal
        accessibilityModalLabel="M'authentifier"
        align="center"
        heading={
          <Tabs
            activeTabIndex={activeIndex || 0}
            onChange={({ activeTabIndex }) => setActiveIndex(activeTabIndex)}
            tabs={[
              { href: "#", text: "Connexion" },
              { href: "#", text: "Inscription" },
            ]}
          />
        }
        onDismiss={closeAuthModal}
        size="sm"
      >
        {activeIndex === 0 ? (
          <Login setActiveIndex={setActiveIndex} />
        ) : (
          <Signup setActiveIndex={setActiveIndex} />
        )}
      </Modal>
    </Layer>
  );
}

const Login = ({ setActiveIndex }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cookie, setCookie] = useCookies(["token"]);

  const { closeAuthModal, setToken, setUser, fingerprint } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let fd = new FormData();
      fd.append("username", username);
      fd.append("email", username);
      fd.append("password", password);
      let res = await fetch(`${BASE_URL}/rest-auth/login/`, {
        method: "POST",
        body: fd,
        headers: {
          fingerprint,
        },
      });
      if (res.status === 200 || res.status === 201) {
        let token = (await res.json()).key;
        let userRes = await fetch(`${BASE_URL}/rest-auth/user/`, {
          headers: {
            Authorization: "Token " + token,
            fingerprint,
          },
        });
        if (userRes.status === 200 || userRes.status === 201) {
          let user = await userRes.json();
          localStorage.setItem("token", token);
          setCookie("token", token, {
            path: "/",
            sameSite: true,
          });
          setToken(token);
          setUser(user);
          notifySuccess(
            `Heureux de vous revoir sur Webchrono, ${user.username}`
          );
          closeAuthModal();
        }
      } else {
        let err = await res.json();
        if (err?.non_field_errors) {
          notifyError("Email ou mot de passe incorrect");
        }
        setError(err);
      }
    } catch (err) {
      console.log(err);
      notifyError("Quelque chose s'est mal passée");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column">
        <TextField
          label="Email"
          value={username}
          onChange={(e) => setUsername(e.value)}
          errorMessage={error?.username}
          type="email"
        />
        <Box marginTop={5}>
          <TextField
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.value)}
            errorMessage={error?.password}
            type="password"
          />
        </Box>
        <Box marginTop={7}>
          <Box marginBottom={2}>
            <Flex justifyContent="center" wrap gap={1}>
              <Text align="center">Pas encore de compte?</Text>
              <TapArea onTap={() => setActiveIndex(1)}>
                <Text weight="bold" align="center" color="error">
                  Inscrivez-vous
                </Text>
              </TapArea>
            </Flex>
          </Box>
          <Button text="Me connecter" fullWidth color="red" type="submit" />
        </Box>
      </Flex>
    </form>
  );
};

const Signup = ({ setActiveIndex }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(null);
  const [cookie, setCookie] = useCookies(["token"]);

  const { closeAuthModal, setToken, setUser, fingerprint } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let fd = new FormData();
      fd.append("username", username);
      fd.append("password1", password);
      fd.append("password2", password2);
      let res = await fetch(`${BASE_URL}/rest-auth/registration/`, {
        method: "POST",
        body: fd,
        headers: {
          fingerprint,
        },
      });
      if (res.status === 200 || res.status === 201) {
        let token = (await res.json()).key;
        console.log(token);
        let userRes = await fetch(`${BASE_URL}/rest-auth/user/`, {
          headers: {
            Authorization: "Token " + token,
            fingerprint,
          },
        });
        if (userRes.status === 200 || userRes.status === 201) {
          let user = await userRes.json();
          localStorage.setItem("token", token);
          setCookie("token", token, {
            path: "/",
            sameSite: true,
          });
          setToken(token);
          setUser(user);
          notifySuccess(`Bienvenue sur Webchrono, ${user.username}`);
          closeAuthModal();
        }
      } else {
        setError(await res.json());
      }
    } catch (err) {
      console.log(err);
      notifyError("Quelque chose s'est mal passée");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column">
        <TextField
          label="Email"
          value={username}
          onChange={(e) => setUsername(e.value)}
          errorMessage={error?.username}
          type="email"
        />
        <Box marginTop={5}>
          <TextField
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.value)}
            errorMessage={error?.password1}
            type="password"
          />
        </Box>
        <Box marginTop={5}>
          <TextField
            label="Confirmez le mot de passe"
            value={password2}
            onChange={(e) => setPassword2(e.value)}
            errorMessage={error?.password2}
            type="password"
          />
        </Box>
        <Box marginTop={7}>
          <Box marginBottom={2}>
            <Flex justifyContent="center" wrap gap={1}>
              <Text align="center">Déjà inscrit?</Text>
              <TapArea onTap={() => setActiveIndex(0)}>
                <Text weight="bold" align="center" color="error">
                  Connectez-vous
                </Text>
              </TapArea>
            </Flex>
          </Box>
          <Button text="M'inscrire" fullWidth color="red" type="submit" />
        </Box>
      </Flex>
    </form>
  );
};
