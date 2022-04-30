import React, { createContext, useContext, useState } from "react";
import { CoinChart } from "../Config/API";
import { useFetchAPISingle } from "../Hooks/useFetchAPISingle";
import { Context, TErrorLoading } from "../Type/type";
import { useCoinContext } from "./CoinContext";
import { GlobalState } from "./GlobalContext";

export type CoinChartData = TErrorLoading & {
  data: {
    market_caps: number[][];
    prices: number[][];
    total_volumes: number[][];
  };
};

type TChartContext = CoinChartData & {
  setDays: React.Dispatch<React.SetStateAction<string | number>>;
  days: number | string;
};

export const ChartContext = createContext({} as TChartContext);

export const ChartState = ({ children }: Context) => {
  const { crypto } = useCoinContext();
  const { currency } = GlobalState();
  const [days, setDays] = useState(1 as number | string);

  const { data, loading, error } = useFetchAPISingle(
    CoinChart(crypto.id, currency, days)
  ) as unknown as CoinChartData;

  return (
    <ChartContext.Provider value={{ data, days, setDays, error, loading }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => {
  return useContext(ChartContext);
};
