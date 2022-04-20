type TGlobalContext = {
  active_cryptocurrencies: number;
  market_cap_change_percentage_24h_usd: number;
  market_cap_percentage: {
    btc: number;
    eth: number;
  };
  markets: number;
  total_market_cap: {
    [index: string]: number;
  };
  total_volume: {
    [index: string]: number;
  };
};

export type TGlobalData = {
  data: {
    data: TGlobalContext;
  };
  error: null | boolean;
  loading: null | boolean;
};

export type TGlobalHeaderProps = {
  error: null | boolean;
  loading: null | boolean;
};

export type AppContextInterface = TGlobalHeaderProps & {
  currency: string;
  symbol: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  global: TGlobal;
};

export type TGlobal = {
  active: number;
  btc: number;
  eth: number;
  market: number;
  mcap: number;
  mcap_change: number;
  volume: number;
};
