import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BLOCKCHAIN_LIST, PROJECT_COINS } from "../Config/API";
import { useFetchAPISingle } from "../Hooks/useFetchAPISingle";
import { Context, CryptoTable, TErrorLoading } from "../Type/type";
import { GlobalState } from "./GlobalContext";

type TBlockchain = {
  content: string;
  id: string;
  market_cap: number;
  market_cap_change_24h: number;
  name: string;
  top_3_coins: string[];
  volume_24h: number;
};

type TProjectInterface = TErrorLoading & {
  blockchain: TBlockchain;
  data: CryptoTable[];
  setEcosystem: React.Dispatch<React.SetStateAction<string>>;
};
type ExchangeData = TErrorLoading & {
  data: CryptoTable[];
};

const ProjectInterface = createContext({} as TProjectInterface);

export const ProjectContext = ({ children }: Context) => {
  const [blockchain, setBlockChain] = useState({} as TBlockchain);
  const [ecosystem, setEcosystem] = useState("");
  const { currency } = GlobalState();

  const { data, loading, error } = useFetchAPISingle(
    PROJECT_COINS(ecosystem, currency)
  ) as unknown as ExchangeData;

  const fetchProjects = async () => {
    setBlockChain({} as TBlockchain);
    const { data: blockchains } = await axios.get(BLOCKCHAIN_LIST());
    const selectedBlockChain = blockchains.find(
      (blockchain: TBlockchain) => blockchain.id === ecosystem
    );

    setBlockChain(selectedBlockChain);
  };

  useEffect(() => {
    fetchProjects();
  }, [ecosystem, currency]);

  return (
    <ProjectInterface.Provider
      value={{ blockchain, data, loading, error, setEcosystem }}
    >
      {children}
    </ProjectInterface.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectInterface);
