import React, { useContext, useState } from "react";
import { BASE_URL } from "../defaults";
import { AuthContext } from "./authContext";
import { useEffect } from "react";
import { notifyError, notifySuccess } from "../utils/notify";

export const WishlistContext = React.createContext();

export default function WishlistProvider({ children }) {
  const [wishlistArticles, setWishlistArticles] = useState([]);
  const { token, fingerprint } = useContext(AuthContext);

  const getData = async () => {
    try {
      var res = await fetch(`${BASE_URL}/api/products/get_wishlist`, {
        headers: token
          ? {
              Authorization: "Token " + token,
              fingerprint,
            }
          : {
              fingerprint,
            },
      });
      var data = await res.json();
      setWishlistArticles(data);
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  const addArticle = (newArticle) => {
    var newList = [newArticle, ...wishlistArticles];
    setWishlistArticles(newList);
  };

  const removeArticle = (articleId) => {
    var newList = [...wishlistArticles]; //copie indépendante du tableau
    newList = newList.filter((item) => item?.id !== articleId);
    setWishlistArticles(newList);
  };

  const toggleLike = async (product) => {
    try {
      let res = await fetch(
        `${BASE_URL}/api/products/${product?.id}/toggle_like`,
        {
          headers: token
            ? {
                Authorization: "Token " + token,
                fingerprint,
              }
            : {
                fingerprint,
              },
        }
      );
      if (res.status === 200 || res.status === 201) {
        let data_res = await res.json();
        if (data_res.result === "added") {
          addArticle(product);
          notifySuccess(`${product?.name} ajouté aux favoris`);
        } else {
          removeArticle(product?.id);
          notifySuccess(`${product?.name} retiré des favoris`);
        }
      } else {
        var data = await res.json();
        if (data === "unauthorized") {
          notifyInfo("Veuillez d'abord vous connecter svp!");
        }
      }
    } catch (err) {
      console.log(err);
      notifyError(`Quelque chose s'est mal passée`);
    }
  };

  useEffect(() => {
    getData();
  }, [token]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistArticles,
        setWishlistArticles,
        toggleLike,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
