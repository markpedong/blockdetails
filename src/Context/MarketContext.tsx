import React, { createContext, useContext, useState } from "react";
import { MarketList } from "../Config/API";
import { useFetchAPISingle } from "../Hooks/useFetchAPISingle";
import { TMarketType } from "../Type/type";
import { useCoinContext } from "./CoinContext";

type Props = {
  children: React.ReactNode;
};

export const MarketAppInterface = createContext({} as TMarketType);

export const MarketContext = ({ children }: Props) => {
  const { crypto } = useCoinContext();
  const [page, setPage] = useState(1);

  const { data, loading, error } = useFetchAPISingle(
    MarketList(crypto.id, page)
  ) as unknown as TMarketType;

  return (
    <MarketAppInterface.Provider
      value={{
        data,
        loading,
        error,
        page,
        setPage,
      }}
    >
      {children}
    </MarketAppInterface.Provider>
  );
};

export const useMarketContext = () => useContext(MarketAppInterface);
