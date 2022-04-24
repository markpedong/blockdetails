import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFI_API, GLOBAL_API } from "../Config/API";
import { useFetchAPIMultiple } from "../Hooks/useFetchMultiple";
import { AppContextInterface, Context } from "../Type/type";

const GlobalData = createContext({} as AppContextInterface);

export const GlobalContext = ({ children }: Context) => {
  const { data, error, loading } = useFetchAPIMultiple([
    `${GLOBAL_API}`,
    `${DEFI_API}`,
  ]);

  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");

  useEffect(() => {
    if (currency === "usd") setSymbol("$");
    if (currency === "php") setSymbol("₱");
    if (currency === "eur") setSymbol("€");
    if (currency === "jpy") setSymbol("¥");
  }, [currency]);

  const global = {
    active: data[0]?.data.active_cryptocurrencies,
    btc: data[0]?.data.market_cap_percentage.btc,
    defi: +data[1]?.data.defi_dominance,
    defimcap: +data[1]?.data.defi_market_cap,
    defi_top: data[1]?.data.top_coin_defi_dominance,
    defi_vol: +data[1]?.data.trading_volume_24h,
    eth: data[0]?.data.market_cap_percentage.eth,
    market: data[0]?.data.markets,
    mcap_change: data[0]?.data.market_cap_change_percentage_24h_usd,
    mcap: data[0]?.data.total_market_cap[currency.toLowerCase()],
    top_name: data[1]?.data.top_coin_name,
    volume: data[0]?.data.total_volume[currency.toLowerCase()],
  };

  return (
    <GlobalData.Provider
      value={{ currency, symbol, setCurrency, error, global, loading }}
    >
      {children}
    </GlobalData.Provider>
  );
};

export const GlobalState = () => {
  return useContext(GlobalData);
};
