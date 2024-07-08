import { BASE_URL } from "../defaults";
import hasObjectValue from "../utils/hasObjectValue";
import { notifyError, notifySuccess } from "../utils/notify";
import { Box, Callout, Heading, Spinner, Text } from "gestalt";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function PaymentCallback() {
  const [savingOrder, setSavingOrder] = useState(false);
  const [loadingTransaction, setLoadingTransaction] = useState(true);
  const [transaction, setTransaction] = useState(null);

  const router = useRouter();
  const { token: transactionToken } = router.query;

  const updateOrderPaymentStatus = async () => {
    setSavingOrder(true);
    let order_id = transaction.state;
    let fd = new FormData();
    fd.append("order_id", order_id);
    fd.append("payment_ref", transactionToken);

    try {
      let _token = localStorage.getItem("token");
      var res = await fetch(
        `${BASE_URL}/api/orders/update_order_payment_status/`,
        {
          method: "POST",
          body: fd,
          headers: {
            Authorization: "Token " + _token,
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        notifySuccess(
          "Commande enregistrée avec succès! Vous recevrez une réponse très rapidement"
        );
        setSavingOrder(false);
        router.push("/commandes");
      } else {
        notifyError(
          "Quelque chose s'est mal passée! Impossible d'enregistrer votre commande!"
        );
        setSavingOrder(false);
      }
    } catch (error) {
      setSavingOrder(false);
    }
  };

  const getTransaction = async () => {
    if (!transactionToken) return;
    setLoadingTransaction(true);
    try {
      let res = await fetch(
        `api/get-credit-card-payment-status?token=${transactionToken}`
      );
      let transaction = await res.json();
      if (res.ok) {
        setTransaction(transaction);
      }
      setLoadingTransaction(false);
    } catch (error) {
      console.log(error);
      setLoadingTransaction(false);
    }
  };

  useEffect(() => {
    getTransaction();
  }, [transactionToken]);

  useEffect(() => {
    if (transaction?.status?.toUpperCase() === "successful") {
      updateOrderPaymentStatus();
    }
  }, [transaction]);

  return (
    <div className="min-h-[70vh] flex flex-col gap-4 justify-center items-center">
      {transaction?.status !== "completed" ? (
        <Box maxWidth={800}>
          <Callout
            iconAccessibilityLabel="Paiement échoué"
            message="Malheureusement, nous ne pourrons pas traiter votre commande car
              nous n'avons pas reçu de paiement. Nous nous excusons pour tout
              inconvénient que cela pourrait causer."
            primaryAction={{
              accessibilityLabel: "Parcourir le catalogue",
              href: "/catalogue",
              label: "Parcourir le catalogue",
              target: "blank",
            }}
            secondaryAction={{
              accessibilityLabel: "Contacter le support",
              href: "/contact",
              label: "Signaler un problème",
              target: "blank",
            }}
            title="Paiement échoué"
            type="error"
          />
        </Box>
      ) : (
        <>
          {savingOrder ? (
            <Heading size="500">Enregistrement de votre commande</Heading>
          ) : (
            <Heading size="500">Ne fermez pas cette page svp!</Heading>
          )}
          {savingOrder ? (
            <Text align="center">
              Votre paiement a été accepté. Nous enregistrons votre commande!
            </Text>
          ) : (
            <Text align="center">
              Nous sommes entrain de vérifier votre paiement et d'enregistrer
              votre commande!
            </Text>
          )}
          <Spinner
            show={loadingTransaction || savingOrder}
            accessibilityLabel="Loading transaction"
          />
        </>
      )}
    </div>
  );
}
