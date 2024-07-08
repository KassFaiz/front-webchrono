import convertCurrency_ from "../utils/convertCurrency";
import formatDate from "../utils/formatDate";
import React, { useCallback, useEffect, useState } from "react";

export const CurrencyContext = React.createContext();

export default function CurrencyProvider({ children }) {
  let savedCurrency =
    typeof window !== "undefined" ? localStorage.getItem("currency") : "eur";
  const [currentCurrency, setCurrentCurrency] = useState(
    savedCurrency || "eur"
  );

  const switchCurrency = (newCurrency) => {
    localStorage.setItem(`currency`, newCurrency);
    setCurrentCurrency(newCurrency);
  };

  const convertCurrency = (
    amount = 0,
    format = true,
    from = "eur",
    to = currentCurrency
  ) => {
    return convertCurrency_({
      amount,
      from,
      to,
      format,
    });
  };

  const getCurrencies = async (latest = false) => {
    let today = latest ? "latest" : formatDate();
    try {
      let currencies = ["usd", "eur", "xof"];
      let currentCurrenciesDate = localStorage.getItem("currencies_date");
      if (today === currentCurrenciesDate) return;
      let responses = await Promise.all(
        currencies.map((curr) =>
          fetch(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${today}/currencies/${curr}.json`
          )
        )
      );
      responses.forEach(async (res, i) => {
        let data = await res.json();
        localStorage.setItem(
          `currencies_${currencies[i]}`,
          JSON.stringify(data)
        );
      });
      localStorage.setItem(`currencies_date`, today);
    } catch (error) {
      getCurrencies(true);
    }
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        switchCurrency,
        convertCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}
