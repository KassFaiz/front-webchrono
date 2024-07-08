import React, { useEffect, useState } from "react";
import { BASE_URL } from "../defaults";

export const SiteConfigsContext = React.createContext();

export default function SiteConfigsProvider({ children }) {
  const [siteConfigs, setConfigs] = useState(null);

  const getData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/core/configs/`);
      if (res.ok) {
        let _configs = await res.json();
        setConfigs(_configs?.length ? _configs[0] : null);
      } else {
        console.log(await res.json());
      }
    } catch (err) {
      console.log("*****", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SiteConfigsContext.Provider
      value={{
        siteConfigs,
      }}
    >
      {children}
    </SiteConfigsContext.Provider>
  );
}
