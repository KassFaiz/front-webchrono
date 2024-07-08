import FingerprintJS from "@fingerprintjs/fingerprintjs";
import React, { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal";
import { notifySuccess } from "../utils/notify";
import { useCookies } from "react-cookie";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [isAuthModalOpened, setAuthModalOpened] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [tokenCookie, setTokenCookie] = useCookies(["token"]);
  const [fingerprintCookie, setFingerprintCookie] = useCookies(["fingerprint"]);
  const [fingerprint, setFingerprint] = useState(
    typeof window !== "undefined" ? localStorage.getItem("fingerprint") : null
  );

  const openAuthModal = () => {
    setAuthModalOpened(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpened(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTokenCookie("token", "", {
      path: "/",
      sameSite: true,
    });
    setToken(null);
    setUser(null);
    notifySuccess("Vous êtes déconnecté!");
  };

  const handleInit = async () => {
    let _token = localStorage.getItem("token");
    setToken(_token);
    if (_token) {
      let userRes = await fetch("http://localhost:8000/rest-auth/user/", {
        headers: {
          Authorization: "Token " + _token,
          fingerprint,
        },
      });
      if (userRes.status === 200 || userRes.status === 201) {
        let user = await userRes.json();
        setUser(user);
      }
    }
  };

  const loadFingerprint = async () => {
    let fingerprint = localStorage.getItem("fingerprint");
    setFingerprint(fingerprint);
    if (!fingerprint) {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      fingerprint = visitorId;
      localStorage.setItem("fingerprint", fingerprint);
      setFingerprintCookie("fingerprint", fingerprint, {
        path: "/",
        sameSite: true,
      });
    }
    setFingerprint(fingerprint);
  };

  useEffect(() => {
    handleInit();
    loadFingerprint();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        openAuthModal,
        closeAuthModal,
        token,
        fingerprint,
        setToken,
        user,
        setUser,
        logout,
      }}
    >
      {children}
      {isAuthModalOpened && <AuthModal />}
    </AuthContext.Provider>
  );
}
