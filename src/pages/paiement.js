import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  RadioGroup,
  Spinner,
  Text,
  TextField,
} from "gestalt";
import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/cartContext";
import { CurrencyContext } from "../context/currencyContext";
import { BASE_URL } from "../defaults";
import { notifyError, notifyInfo } from "../utils/notify";
import { SiteConfigsContext } from "../context/siteConfigsContext";
import { AuthContext } from "../context/authContext";

export default function Paiement() {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [deliveryAdress, setDeliveryAdress] = useState("");
  const [deliveryAdress2, setDeliveryAdress2] = useState("");
  const [deliveryType, setDeliveryType] = useState("dhl");
  const [promocode, setPromocode] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [paymentMode, setPaymentMode] = useState("mobilemoney");
  const [generatingPaymentUrl, setGeneratingPaymentUrl] = useState(false);

  const {
    totalPrice,
    applyPromocode,
    usedPromoCodes,
    deliveryPrice: deliveryPrice_,
    totalWeight,
    cartitems,
  } = useContext(CartContext);
  const { convertCurrency, currentCurrency } = useContext(CurrencyContext);
  const { siteConfigs } = useContext(SiteConfigsContext);
  const { token } = useContext(AuthContext);

  const checkForm = () => {
    return (
      userLastName !== "" &&
      userFirstName !== "" &&
      email !== "" &&
      phone !== "" &&
      ville !== "" &&
      pays !== "" &&
      zipcode !== "" &&
      deliveryAdress !== "" &&
      deliveryType !== ""
    );
  };

  const handleSubmit = async () => {
    if (!token)
      return notifyInfo(
        "Veuillez vous connecter ou créer un compte pour passer une commande"
      );
    if (checkForm() === false)
      return notifyInfo(
        "Veuillez remplir tous les champs obligatoires du formulaire"
      );
    setGeneratingPaymentUrl(true);
    const fd = new FormData();
    fd.append("user_lastname", userLastName);
    fd.append("user_firstname", userFirstName);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("ville", ville);
    fd.append("pays", pays);
    fd.append("zip_code", zipcode);
    fd.append("delivery_adress", deliveryAdress);
    fd.append("delivery_adress_2", deliveryAdress2);
    fd.append("delivery_type", deliveryType);
    fd.append("delivery_price", deliveryPrice || 0);
    fd.append("cart_total_price", totalPrice || 0);

    try {
      let _token = localStorage.getItem("token");
      var res = await fetch(`${BASE_URL}/api/orders/`, {
        method: "POST",
        body: fd,
        headers: {
          Authorization: "Token " + _token,
        },
      });
      if (res.status === 200 || res.status === 201) {
        var newOrder = await res.json();
        paymentMode === "mobilemoney"
          ? await getMobilePaymentUrl({ order_id: newOrder?.id })
          : await getCreditCardPaymentUrl({ order_id: newOrder?.id });
        setGeneratingPaymentUrl(false);
      } else {
        notifyError("Quelque chose s'est mal passée!");
        setGeneratingPaymentUrl(false);
      }
    } catch (error) {
      console.log(error);
      notifyError("Quelque chose s'est mal passée!");
      setGeneratingPaymentUrl(false);
    }
  };

  const handlePromocode = () => {
    if (usedPromoCodes?.filter((pc) => pc?.code === promocode)?.length)
      return notifyError("Vous avez déjà utilisé ce code promo!");
    applyPromocode(promocode, () => setPromocode(""));
  };

  const getMobilePaymentUrl = async (orderCustomData) => {
    setGeneratingPaymentUrl(true);
    var payload = JSON.stringify({
      commande: {
        invoice: {
          items: cartitems?.map((cartitem) => ({
            name: cartitem?.product?.name,
            description: cartitem?.product?.description,
            quantity: cartitem?.quantity,
            unit_price: cartitem?.product?.price,
            total_price: convertCurrency(
              cartitem?.final_amount,
              false,
              "eur",
              "xof"
            ),
          })),
          total_amount: convertCurrency(
            totalPrice + deliveryPrice,
            false,
            "eur",
            "xof"
          ),
          devise: "XOF",
          description: "Achat de produits sur webchrono.com",
          customer: "",
          customer_firstname: userFirstName | "",
          customer_lastname: userLastName || "",
          customer_email: email || "",
          external_id: "",
          otp: "",
        },
        store: {
          name: "Webchrono",
          website_url: "webchrono.com",
        },
        actions: {
          cancel_url: `${window.location.origin}/mobile-payment-callback`,
          return_url: `${window.location.origin}/mobile-payment-callback`,
          callback_url: `${window.location.origin}/mobile-payment-callback`,
        },
        custom_data: {
          order_data: JSON.stringify(orderCustomData),
        },
      },
    });

    try {
      let res = await fetch(
        "https://app.ligdicash.com/pay/v01/redirect/checkout-invoice/create",
        {
          method: "POST",
          body: payload,
          headers: {
            Apikey: process.env.NEXT_PUBLIC_LIGDICASH_API_KEY,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIGDICASH_AUTH_TOKEN}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      let transaction = await res.json();
      if (transaction?.response_code === "00") {
        let paymentUrl = transaction?.response_text;
        setGeneratingPaymentUrl(false);
        window.location = paymentUrl;
      }
      setGeneratingPaymentUrl(false);
    } catch (error) {
      console.log("ligdicash error", error);
      setGeneratingPaymentUrl(false);
    }
  };

  const getCreditCardPaymentUrl = async (orderCustomData) => {
    setGeneratingPaymentUrl(true);
    let orderId = `webchronomarket_${orderCustomData?.order_id}`;
    var payload = JSON.stringify({
      order_id: orderId,
      amount: convertCurrency(totalPrice + deliveryPrice, false, "eur", "xof"),
      return_url: `${window.location.origin}/credit-card-payment-callback?token=${orderId}`,
      cancel_url: `${window.location.origin}/credit-card-payment-callback?token=${orderId}`,
      state: JSON.stringify(orderCustomData?.order_id),
    });

    var requestOptions = {
      method: "POST",
      body: payload,
    };

    try {
      let res = await fetch("api/get-credit-card-payment-url", requestOptions);
      let transaction = await res.json();
      if (transaction?.message === "OK") {
        let paymentUrl = transaction?.payment_url;
        setGeneratingPaymentUrl(false);
        window.location = paymentUrl;
      }
      setGeneratingPaymentUrl(false);
    } catch (error) {
      console.log("bizao error", error);
      setGeneratingPaymentUrl(false);
    }
  };

  useEffect(() => {
    setDeliveryPrice(deliveryPrice_[deliveryType]);
  }, [deliveryType, deliveryPrice_]);

  return (
    <>
      <Head>
        <title>Webchrono | Paiement</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box
        paddingX={3}
        smPaddingX={6}
        mdPaddingX={12}
        marginTop={12}
        marginBottom={12}
      >
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-10 lg:gap-12">
          {/* Box 1 */}
          <div className="sm:flex-[3]">
            <Box borderStyle="sm" borderSize="1px">
              <Box paddingX={4} paddingY={4} color="dark">
                <Heading color="light" size="400">
                  Informations de Livraison
                </Heading>
              </Box>
              <Box paddingY={10} paddingX={4}>
                <form className="delivery-form-wrapper">
                  <TextField
                    label="Nom*"
                    value={userLastName}
                    onChange={(e) => {
                      setUserLastName(e.value);
                    }}
                  />
                  <TextField
                    label="Prénom(s)*"
                    value={userFirstName}
                    onChange={(e) => {
                      setUserFirstName(e.value);
                    }}
                  />
                  <TextField
                    label="Adresse Email*"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.value);
                    }}
                  />
                  <TextField
                    label="Numéro de téléphone*"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.value);
                    }}
                  />
                  <TextField
                    label="Ville*"
                    value={ville}
                    onChange={(e) => {
                      setVille(e.value);
                    }}
                  />
                  <TextField
                    label="Pays*"
                    value={pays}
                    onChange={(e) => {
                      setPays(e.value);
                    }}
                  />
                  <div style={{ gridColumn: "span 2 / span 2" }}>
                    <TextField
                      label="Code postal*"
                      value={zipcode}
                      onChange={(e) => {
                        setZipcode(e.value);
                      }}
                    />
                  </div>
                  <TextField
                    label="Adresse de livraison*"
                    value={deliveryAdress}
                    onChange={(e) => {
                      setDeliveryAdress(e.value);
                    }}
                  />
                  <TextField
                    label="Adresse 2"
                    value={deliveryAdress2}
                    onChange={(e) => {
                      setDeliveryAdress2(e.value);
                    }}
                  />
                  <div style={{ gridColumn: "span 2 / span 2" }}>
                    <RadioGroup legend="Mode de livraison*" direction="row">
                      <RadioGroup.RadioButton
                        checked={deliveryType === "dhl"}
                        id="delivery-type-dhl"
                        label="DHL"
                        name="delivery-name"
                        onChange={() => setDeliveryType("dhl")}
                        value="dhl"
                      />
                      <RadioGroup.RadioButton
                        checked={deliveryType === "laposte"}
                        id="delivery-type-laposte"
                        label="La poste"
                        name="delivery-name"
                        onChange={() => setDeliveryType("laposte")}
                        value="laposte"
                      />
                    </RadioGroup>
                  </div>
                  <div style={{ gridColumn: "span 2 / span 2" }}>
                    <RadioGroup legend="Mode de paiement*" direction="row">
                      <RadioGroup.RadioButton
                        checked={paymentMode === "mobilemoney"}
                        id="payment-mode-mobilemoney"
                        label="Mobile Money"
                        name="payment-mode"
                        onChange={() => setPaymentMode("mobilemoney")}
                        value="mobilemoney"
                      />
                      <RadioGroup.RadioButton
                        checked={paymentMode === "creditcard"}
                        id="payment-mode-creditcard"
                        label="Bancaire"
                        name="payment-mode"
                        onChange={() => setPaymentMode("creditcard")}
                        value="creditcard"
                      />
                    </RadioGroup>
                  </div>
                </form>
              </Box>
            </Box>
          </div>
          {/* Box 2 */}
          <div className="md:flex-[1.5]">
            <Flex direction="column">
              <Box borderStyle="sm" borderSize="1px">
                <Box paddingX={4} paddingY={4} color="dark">
                  <Heading size="400" color="light">
                    Récapitulatif
                  </Heading>
                </Box>
                <Box paddingX={4} paddingY={5}>
                  <Box marginTop={1}>
                    <Flex justifyContent="between">
                      <Text>Poids:</Text>
                      <Text>{totalWeight}Kg</Text>
                    </Flex>
                  </Box>
                  <Box marginTop={1}>
                    <Flex justifyContent="between">
                      <Text>Sous-Total:</Text>
                      <Text>{convertCurrency(totalPrice)}</Text>
                    </Flex>
                  </Box>
                  <Box marginTop={1}>
                    <Flex justifyContent="between">
                      <Text>Frais de livraison:</Text>
                      <Text>{convertCurrency(deliveryPrice)}</Text>
                    </Flex>
                  </Box>
                  <Box marginTop={3}>
                    <Flex justifyContent="between">
                      <Text weight="bold">TOTAL:</Text>
                      <Text weight="bold" color="error">
                        {convertCurrency(totalPrice + deliveryPrice)}
                      </Text>
                    </Flex>
                  </Box>
                </Box>
              </Box>

              <Box marginTop={7} borderStyle="sm" borderSize="1px">
                <Box paddingX={4} paddingY={4} color="secondary">
                  <Heading size="300">Coupon</Heading>
                </Box>
                {usedPromoCodes?.length ? (
                  <Box paddingX={4} marginTop={4}>
                    <Flex gap={1} wrap>
                      {usedPromoCodes?.map((promocode) => (
                        <Badge
                          key={promocode?.id}
                          text={`${promocode?.code} - ${
                            promocode?.discount_value
                          }${
                            promocode?.discount_type === "percentage"
                              ? "%"
                              : currentCurrency === "usd"
                              ? "$"
                              : currentCurrency === "eur"
                              ? "€"
                              : "F CFA"
                          }`}
                          type="darkWash"
                        />
                      ))}
                    </Flex>
                  </Box>
                ) : null}
                <Box paddingX={4} paddingY={5}>
                  <Box marginBottom={2}>
                    <TextField
                      label="Entrez votre code promo"
                      value={promocode}
                      onChange={({ value }) => setPromocode(value)}
                    />
                  </Box>
                  <Button
                    text="Verifier le code"
                    fullWidth
                    onClick={handlePromocode}
                  />
                </Box>
              </Box>

              <Box marginTop={7}>
                {generatingPaymentUrl ? (
                  <Spinner
                    show={true}
                    accessibilityLabel="Generating payment url"
                    size="sm"
                  />
                ) : (
                  <Flex direction="column" gap={2}>
                    <Button
                      text="Passer au paiement"
                      fullWidth
                      color="red"
                      onClick={handleSubmit}
                    />
                    {siteConfigs?.whatsapp_link && (
                      <Link
                        href={`${
                          siteConfigs?.whatsapp_link
                        }?text=Bonjour, je souhaite passer une commande sur webchronomarket.com. Voici mon nom: ${
                          userFirstName || ""
                        } ${userLastName || ""}`}
                        target="blank"
                      >
                        <Button
                          text="Discuter sur WhatsApp"
                          fullWidth
                          color="gray"
                          iconEnd="whats-app"
                        />
                      </Link>
                    )}
                  </Flex>
                )}
              </Box>
            </Flex>
          </div>
        </div>
      </Box>
    </>
  );
}
