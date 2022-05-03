import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CoinList } from "../Config/API";
import { Context, TableContextInterface } from "../Type/type";
import { GlobalState } from "./GlobalContext";

const TableData = createContext({} as TableContextInterface);

export const TableContext = ({ children }: Context) => {
  const { currency, error, loading } = GlobalState();
  const [page, setPage] = useState(1);
  const [coins, setCoins] = useState([]);
  const [res_page, setResPage] = useState(100);

  useEffect(() => {
    const fetchCoins = async () => {
      const { data } = await axios.get(CoinList(currency, page, res_page));

      setCoins(data);
      setPage(page);
    };

    fetchCoins();
  }, [currency, page, res_page]);

  return (
    <TableData.Provider
      value={{ coins, error, loading, page, setPage, res_page, setResPage }}
    >
      {children}
    </TableData.Provider>
  );
};

export const TableState = () => {
  return useContext(TableData);
};
