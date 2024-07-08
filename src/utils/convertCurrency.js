export default function convertCurrency({
  amount = 0,
  from = "eur",
  to = "eur",
  format = true,
}) {
  let newAmount = amount;
  try {
    let fromCurrencies = localStorage.getItem(`currencies_${from}`);
    if (!fromCurrencies) return newAmount;
    fromCurrencies = JSON.parse(fromCurrencies);
    newAmount = fromCurrencies?.eur[to] * amount;
    if (format === false)
      return to === "xof" ? parseInt(newAmount) : newAmount.toFixed(2);
    return newAmount.toLocaleString("fr-FR", {
      style: "currency",
      currency: to,
    });
  } catch (error) {
    console.log(error);
    return newAmount;
  }
}
