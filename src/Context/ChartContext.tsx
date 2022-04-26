import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CoinChart } from "../Config/API";
import { useCoinContext } from "./CoinContext";
import { GlobalState } from "./GlobalContext";

type Props = {
  children: React.ReactNode;
};

type CoinChartData = {
  chart: {
    market_caps: any;
    prices: any;
    total_volumes: any;
  };
};

type TChartContext = CoinChartData & {
  setDays: React.Dispatch<React.SetStateAction<number>>;
  days: number;
};

export const ChartContext = createContext({} as TChartContext);

export const ChartState = ({ children }: Props) => {
  const { crypto } = useCoinContext();
  const [chart, setChart] = useState({} as any);
  const { currency } = GlobalState();
  const [days, setDays] = useState(1);

  const fetchChart = async () => {
    const { data } = await axios.get(CoinChart(crypto.id, currency, days));
    console.log(data);
    setChart(data);
  };

  useEffect(() => {
    fetchChart();
  }, [currency, days]);

  return (
    <ChartContext.Provider value={{ chart, days, setDays }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => {
  return useContext(ChartContext);
};
