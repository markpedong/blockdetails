import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { TrendingCoins } from "../Config/API";
import { Context, TrendingInterface, TTrending } from "../Type/type";
import { GlobalState } from "./GlobalContext";

export const TrendingContext = createContext({} as TrendingInterface);

export const TrendingCoinContext = ({ children }: Context) => {
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
