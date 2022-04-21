import React, { createContext, useContext, useEffect, useState } from "react";
import { GLOBAL_API } from "../Config/API";
import { Context } from "../Config/Type/type";
import { useFetchAPISingle } from "../Hooks/useFetchAPISingle";
import { AppContextInterface, TGlobalData } from "../Type/GlobalData";

const GlobalData = createContext({} as AppContextInterface);

export const GlobalContext = ({ children }: Context) => {
  const { data, error, loading } = useFetchAPISingle(
    `${GLOBAL_API}`
  ) as unknown as TGlobalData;

  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");

  useEffect(() => {
    if (currency === "USD") setSymbol("$");
    if (currency === "PHP") setSymbol("₱");
  }, [currency]);

  const global = {
    active: data?.data.active_cryptocurrencies,
    btc: data?.data.market_cap_percentage.btc,
    eth: data?.data.market_cap_percentage.eth,
    market: data?.data.markets,
    mcap_change: data?.data.market_cap_change_percentage_24h_usd,
    mcap: data?.data.total_market_cap[currency.toLowerCase()],
    volume: data?.data.total_volume[currency.toLowerCase()],
  };

  return (
    <GlobalData.Provider
      value={{ currency, symbol, setCurrency, global, error, loading }}
    >
      {children}
    </GlobalData.Provider>
  );
};

export const GlobalState = () => {
  return useContext(GlobalData);
};
