import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { TrendingCoins } from "../Config/API";
import { TTrending } from "../Type/type";
import { GlobalState } from "./GlobalContext";

type Props = {
  children: React.ReactNode;
};

type TrendingInterface = {
  trending: TTrending[];
};

export const TrendingContext = createContext({} as TrendingInterface);

export const TrendingCoinContext = ({ children }: Props) => {
  const { currency } = GlobalState();
  const [trending, setTrending] = useState([] as TTrending[]);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);
    };

    fetchTrendingCoins();
  }, [currency]);

  return (
    <TrendingContext.Provider
      value={{
        trending,
      }}
    >
      {children}
    </TrendingContext.Provider>
  );
};

export const TrendingState = () => {
  return useContext(TrendingContext);
};
