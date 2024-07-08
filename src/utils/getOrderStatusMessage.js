const getOrderStatusMessage = (order) => {
  if (!order)
    return {
      title: "",
      message: "",
      type: "info",
    };

  if (order?.status === "pending") {
    return {
      title: "Confirmation en cours...",
      type: "warning",
      message:
        "Veuillez patientez, nous sommes en train d'étudier votre commande. Vous recevrez une réponse très rapidement",
    };
  } else if (order.status === "accepted") {
    return {
      title: "Commande acceptée",
      type: "info",
      message:
        "Félicitations! Votre commande a été acceptée et la livraison de vos produits sera lancée très rapidement",
    };
  } else if (order.status === "rejected") {
    return {
      title: "Commande rejeté",
      type: "error",
      message:
        "Nous sommes désolé! Nous ne pourrrons pas donné de suite à votre commande. \nVous serez remboursé entièrement d'ici quelques jours",
    };
  } else if (order.status === "delivery_started") {
    return {
      title: "Livraison lancée",
      type: "info",
      message:
        "La livraison de votre colis a débutée. Vous allez le recevoir très rapidement. En attendant, cliquez sur le bouton en bas pour suivre le trajet.",
    };
  } else if (order.status === "delivery_ended") {
    return {
      title: "Livraison terminée",
      type: "success",
      message: "Hourra! Votre colis est arrivé à l'adresse indiquée.",
    };
  } else if (order.status === "aborted") {
    return {
      title: "Commande annulée",
      type: "neutral",
      message:
        "Vous avez annulé cette commande. Votre remboursement est en cours",
    };
  }

  return {
    title: "",
    message: "",
    type: "info",
  };
};

export default getOrderStatusMessage;
