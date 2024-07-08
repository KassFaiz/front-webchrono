import Cart from "../components/Cart";
import { BASE_URL } from "../defaults";
import React, { useContext, useEffect, useState } from "react";
import { notifyError, notifyInfo, notifySuccess } from "../utils/notify";
import { AuthContext } from "./authContext";

export const CartContext = React.createContext();

export default function CartProvider({ children }) {
  const [isCartOpened, setIsCartOpened] = useState(false);
  const [usedPromoCodes, setUsedPromoCodes] = useState([]);
  const [deliveryPrice, setDeliveryPrice] = useState({ dhl: 0, laposte: 0 });
  const [cartitems, setCartitems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  const { token, fingerprint } = useContext(AuthContext);

  const openCart = () => {
    setIsCartOpened(true);
  };

  const closeCart = () => {
    setIsCartOpened(false);
  };

  const getData = async () => {
    try {
      var res = await fetch(
        `${BASE_URL}/api/cart-items/get_logged_user_cart/`,
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
      var data = await res.json();
      console.log("*******", data);
      setDeliveryPrice({
        dhl: data?.delivery_price_dhl || 0,
        laposte: data?.delivery_price_laposte || 0,
      });
      setCartitems(data.cart_items);
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  const getTotalPrice = () => {
    var total = 0;
    cartitems.forEach(function (cartitem) {
      if (cartitem?.product) {
        total = total + cartitem?.final_amount;
      }
    });
    setTotalPrice(total);
  };

  const getTotalWeight = () => {
    var total = 0;
    cartitems.forEach(function (cartitem) {
      if (cartitem?.product) {
        total = total + cartitem?.weight;
      }
    });
    setTotalWeight(total);
  };

  const getUsedPromoCodes = () => {
    var promoCodes = [];
    cartitems.forEach(function (cartitem) {
      promoCodes = [...promoCodes, ...cartitem.used_promo_codes];
    });
    setUsedPromoCodes(promoCodes);
  };

  const removeCartitem = (cartitemId) => {
    var newList = [...cartitems]; //copie indépendante du tableau
    let oldCartitem = newList.find((item) => item?.id === cartitemId);
    newList = newList.filter((item) => item?.id !== cartitemId); //filtrage du nouveau tableau en ne gardant que les éléments(item) dont le id est différent du id de l'élément à supprimer
    // Update delivery price
    let newDeliveryPriceDhl =
      deliveryPrice.dhl - (oldCartitem?.delivery_price_dhl || 0);
    let newDeliveryPriceLaposte =
      deliveryPrice.laposte - (oldCartitem?.delivery_price_laposte || 0);
    setDeliveryPrice({
      dhl: newDeliveryPriceDhl,
      laposte: newDeliveryPriceLaposte,
    });
    // Update cartitems list
    setCartitems(newList); //mettre la liste des cartitems à jour
  };

  const updateCartitem = (newCartitem) => {
    var newList = [...cartitems]; //copie indépendante du tableau
    let oldCartitem = newList.find((item) => item?.id === newCartitem.id);
    let cartitemIndex = newList.findIndex(
      (item) => item?.id === newCartitem.id
    ); //filtrage du nouveau tableau en ne gardant que les éléments(item) dont le id est différent du id de l'élément à supprimer
    newList[cartitemIndex] = newCartitem;
    // Update delivery price
    let newDeliveryPriceDhl =
      deliveryPrice.dhl - (oldCartitem?.delivery_price_dhl || 0);
    let newDeliveryPriceLaposte =
      deliveryPrice.laposte - (oldCartitem?.delivery_price_laposte || 0);
    newDeliveryPriceDhl += newCartitem.delivery_price_dhl;
    newDeliveryPriceLaposte += newCartitem.delivery_price_laposte;
    setDeliveryPrice({
      dhl: newDeliveryPriceDhl,
      laposte: newDeliveryPriceLaposte,
    });
    // Update cartitems list
    setCartitems(newList); //mettre la liste des cartitems à jour
  };

  const removeFromCart = async (cartitem, product) => {
    if (!cartitem) {
      cartitem = cartitems.find((item) => item.product.id === product.id);
    }
    try {
      var res = await fetch(`${BASE_URL}/api/cart-items/${cartitem?.id}/`, {
        method: "DELETE",
        headers: token
          ? {
              Authorization: "Token " + token,
              fingerprint,
            }
          : {
              fingerprint,
            },
      });
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        removeCartitem(cartitem?.id);
        notifySuccess(`${cartitem.product.name} retiré du panier`);
      } else {
        var data = await res.json();
        if (data === "unauthorized") {
          notifyInfo("Veuillez d'abord vous connecter svp!");
        }
      }
    } catch (error) {
      console.log(error);
      notifyError(`Quelque chose s'est mal passée`);
    }
  };

  const addToCart = async (quantity, size, product) => {
    const fd = new FormData();
    fd.append("quantity", quantity);
    fd.append("product_id", product?.id);
    if (!size) {
      let sizes = product?.sizes?.split(";");
      size = sizes?.length ? sizes[0] : "";
    }
    fd.append("size", size);
    try {
      var res = await fetch(`${BASE_URL}/api/cart-items/add_product_to_cart/`, {
        method: "POST",
        body: fd,
        headers: token
          ? {
              Authorization: "Token " + token,
              fingerprint,
            }
          : {
              fingerprint,
            },
      });
      if (res.status === 200 || res.status === 201) {
        let newCartitem = await res.json();
        getData();
        notifySuccess(`${newCartitem.product.name} ajouté au panier`);
      } else {
        var data = await res.json();
        if (data === "unauthorized") {
          notifyInfo("Veuillez d'abord vous connecter svp!");
        }
      }
    } catch (error) {
      console.log(error);
      notifyError(`Quelque chose s'est mal passée`);
    }
  };

  const editCartitem = async (quantity, cartitem) => {
    let fd = new FormData();
    fd.append("quantity", quantity >= 1 ? quantity : 1);

    try {
      var res = await fetch(`${BASE_URL}/api/cart-items/${cartitem?.id}/`, {
        method: "PATCH",
        body: fd,
        headers: token
          ? {
              Authorization: "Token " + token,
              fingerprint,
            }
          : {
              fingerprint,
            },
      });
      var newCartitem = await res.json();
      updateCartitem(newCartitem);
      notifySuccess(`Quantité modifiée pour ${cartitem.product.name}`);
    } catch (error) {
      console.log(error);
      notifyError(`Quelque chose s'est mal passée`);
    }
  };

  const applyPromocode = async (promocode = "", callback = null) => {
    if (!token) return notifyInfo("Veuillez d'abord vous connecter svp!");
    try {
      var res = await fetch(
        `${BASE_URL}/api/cart-items/apply_promo_code/?promo_code=${promocode}`,
        {
          headers: {
            Authorization: "Token " + token,
            fingerprint,
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        let cart = await res.json();
        setDeliveryPrice({
          dhl: data?.delivery_price_dhl || 0,
          laposte: data?.delivery_price_laposte || 0,
        });
        setCartitems(cart.cart_items);
        notifySuccess("Code promo accepté!");
        callback && callback();
      } else {
        let error = await res.json();
        notifyError(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //Charger les données au chargement de la page
    getData();
  }, [token]); //Tableau de dépendances vide, donc l'effet s'exécute qu'une seule fois

  useEffect(() => {
    if (cartitems?.length >= 0) {
      getTotalPrice();
      getTotalWeight();
      getUsedPromoCodes();
    }
  }, [cartitems]); //L'effet est exécuté à chaque fois que l'un des éléments du tableau de dépendances change de valeur

  return (
    <CartContext.Provider
      value={{
        isCartOpened,
        openCart,
        closeCart,
        cartitems,
        applyPromocode,
        cartitemsTotal: cartitems?.length || 0,
        removeFromCart,
        totalPrice,
        totalWeight,
        addToCart,
        editCartitem,
        usedPromoCodes,
        deliveryPrice,
      }}
    >
      {children}
      {isCartOpened && <Cart />}
    </CartContext.Provider>
  );
}
