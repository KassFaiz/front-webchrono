import React, { useState } from "react";
import { Box, Button, Flex, Heading, TextField } from "gestalt";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { notifyError, notifySuccess } from "../utils/notify";
import { BASE_URL } from "../defaults";
import Head from "next/head";

function Compte() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [errors, setErrors] = useState(null);

  const { user, token, setUser } = useContext(AuthContext);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors(null);
    if (!oldPassword)
      return notifyError("Veuillez renseigner l'actuel mot de passe!");
    if (!newPassword1)
      return notifyError("Veuillez renseigner le nouveau mot de passe!");
    if (!newPassword2)
      return notifyError("Veuillez confirmer le nouveau mot de passe!");

    let fd = new FormData();
    fd.append("new_password1", newPassword1);
    fd.append("new_password2", newPassword2);
    fd.append("old_password", oldPassword);
    let res = await fetch(`${BASE_URL}/rest-auth/password/change/`, {
      method: "POST",
      body: fd,
      headers: {
        Authorization: "Token " + token,
      },
    });
    if (res.ok) {
      setOldPassword("");
      setNewPassword1("");
      setNewPassword2("");
      notifySuccess("Mot de passe modifié avec succès!");
    } else {
      let _errors = await res.json();
      console.log(_errors);
      setErrors(_errors);
      notifyError("Impossible de modifier votre mot de passe!");
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setErrors(null);
    if (!email || email === user?.username)
      return notifyError("Veuillez renseigner un nouvel email!");
    let fd = new FormData();
    fd.append("username", email);
    fd.append("email", email);
    let res = await fetch(`${BASE_URL}/rest-auth/user/`, {
      method: "PATCH",
      body: fd,
      headers: {
        Authorization: "Token " + token,
      },
    });
    if (res.ok) {
      let newUser = await res.json();
      setUser(newUser);
      notifySuccess("Email modifié avec succès!");
    } else {
      let _errors = await res.json();
      console.log(_errors);
      setErrors(_errors);
      notifyError("Impossible de modifier votre email!");
    }
  };

  return (
    <>
      <Head>
        <title>Webchrono | Mon compte</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div style={{ minHeight: "100vh" }}>
        <Box
          marginTop={7}
          marginBottom={12}
          paddingX={3}
          smPaddingX={6}
          mdPaddingX={12}
        >
          <Heading align="start">Paramètres de compte</Heading>
          <Box marginTop={10}>
            <div className="flex flex-col sm:flex-row justify-between gap-10 gap-y-20 md:gap-20 lg:gap-40">
              <div className="flex-1">
                <Flex direction="column" gap={2}>
                  <Heading align="start" size="400">
                    Email
                  </Heading>
                  <form className="no-default" onSubmit={handleEmailChange}>
                    <Flex direction="column" gap={2}>
                      <TextField
                        label="Tapez pour modifier"
                        value={token ? email || user?.username : ""}
                        onChange={(e) => setEmail(e.value)}
                        type="email"
                      />
                      <Button
                        text="Enregistrer"
                        fullWidth
                        type="submit"
                        color="red"
                      />
                    </Flex>
                  </form>
                </Flex>
              </div>
              <div className="flex-1">
                <Flex direction="column" gap={2}>
                  <Heading align="start" size="400">
                    Mot de passe
                  </Heading>
                  <form className="no-default" onSubmit={handlePasswordChange}>
                    <Flex direction="column" gap={2}>
                      <TextField
                        label="Ancien mot de passe"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.value)}
                        type="password"
                        errorMessage={errors?.old_password}
                      />
                      <TextField
                        label="Nouveau mot de passe"
                        value={newPassword1}
                        onChange={(e) => setNewPassword1(e.value)}
                        type="password"
                        errorMessage={errors?.new_password2?.map((error) => {
                          console.log(error);
                          return error?.replace("nom d’utilisateur", "email");
                        })}
                      />
                      <TextField
                        label="Confirmez le nouveau mot de passe"
                        value={newPassword2}
                        onChange={(e) => setNewPassword2(e.value)}
                        type="password"
                      />
                      <Button
                        text="Enregistrer"
                        color="red"
                        fullWidth
                        type="submit"
                      />
                    </Flex>
                  </form>
                </Flex>
              </div>
            </div>
          </Box>
        </Box>
      </div>
    </>
  );
}

export default Compte;
