import { ReactNode } from "react";

export type Context = {
  children: React.ReactNode;
};

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

export type TErrorLoading = {
  error: null | boolean;
  loading: null | boolean;
};

export type AppContextInterface = TErrorLoading & {
  currency: string;
  symbol: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  global: TGlobal;
};

export type CryptoTable = {
  circulating_supply: number;
  current_price: number;
  id: string;
  image: string;
  market_cap: number | string;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number | string;
  name: string;
  price_change_percentage_24h: number;
  symbol: string;
  total_supply: number | string;
  total_volume: number;
};

export type TableContextInterface = TErrorLoading & {
  coins: CryptoTable[];
  page: number;
  res_page: number;
  setResPage: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export type TGlobal = {
  active: number;
  btc: number;
  defi: number;
  defi_top: number;
  defi_vol: number;
  defimcap: number;
  eth: number;
  market: number;
  mcap: number;
  mcap_change: number;
  top_name: string;
  volume: number;
};

export type TTrending = {
  current_price: number;
  id: string;
  image: string;
  name: string;
  symbol: string;
  price_change_percentage_24h: number;
};

export type TProfitChange = {
  profit: boolean;
};

export type TCryptoDetail = TErrorLoading & {
  data: {
    categories: string[];
    coingecko_rank: number;
    community_data: {
      facebook_likes: number;
      reddit_accounts_active_48h: number;
      reddit_average_comments_48h: number;
      reddit_average_posts_48h: number;
      reddit_subscribers: number;
      telegram_channel_user_count: number;
      twitter_followers: number;
    };
    community_score: number;
    description: {
      en: string;
    };
    genesis_date: string;
    hashing_algorithm: string;
    id: string;
    image: {
      large: string;
      small: string;
      thumb: string;
    };
    links: {
      blockchain_site: string[];
      chat_url: string[];
      homepage: string[];
      official_forum_url: string[];
      repos_url: {
        github: string[];
      };
      subreddit_url: string;
    };
    liquidity_score: number;
    market_cap_rank: number;
    market_data: {
      ath: { [index: string]: number };
      ath_change_percentage: { [index: string]: number };
      ath_date: { [index: string]: string };
      atl: { [index: string]: number };
      atl_change_percentage: { [index: string]: number };
      atl_date: { [index: string]: string };
      circulating_supply: number;
      current_price: { [index: string]: string };
      fully_diluted_valuation: { [index: string]: string };
      high_24h: { [index: string]: string };
      low_24h: { [index: string]: string };
      market_cap: { [index: string]: number };
      market_cap_change_percentage_24h_in_currency: { [index: string]: number };
      market_cap_rank: number;
      max_supply: number;
      price_change_percentage_1y_in_currency: { [index: string]: number };
      price_change_percentage_7d_in_currency: { [index: string]: number };
      price_change_24h_in_currency: { [index: string]: number };
      price_change_percentage_24h_in_currency: { [index: string]: number };
      price_change_percentage_14d_in_currency: { [index: string]: number };
      price_change_percentage_30d_in_currency: { [index: string]: number };
      total_supply: number;
      total_volume: { [index: string]: number };
    };
    name: string;
    symbol: string;
    tickers: {
      market: {
        identifier: string;
        name: string;
      };
      target: string;
      target_coin_id: string;
      trade_url: string;
      volume: number;
    }[];
  };
};

export type TCrypto = {
  algo: string;
  ath_date: string;
  ath_per: number;
  ath: string;
  atl_date: string;
  atl_per: number;
  atl: string;
  categories: string[];
  categories1: string;
  categories2: string;
  circ_supply: string;
  date_origin: string;
  description: string;
  forum_site: string[];
  high_24: string;
  home_site: string;
  id: string;
  img_large: string;
  img_small: string;
  img_thumb: string;
  liq_score: number;
  low_24: string;
  max_supply: string;
  mcap_per: number;
  mcap_rank: number;
  mcap: string;
  name: string;
  price_change: number;
  price_per: number;
  price_7d: number;
  price_30d: number;
  price_1yr: number;
  price: string | number;
  rank: number;
  reddit: string;
  scan_site: string[];
  source_code: string[];
  symbol: string;
  tickers: {
    market: {
      identifier: string;
      name: string;
    };
    target: string;
    target_coin_id: string;
    trade_url: string;
    volume: number;
  }[];
  total_supply: string;
  valuation: string;
  volume: string;
  volumetomcap: number;
};

export type TMarketType = TErrorLoading & {
  data: {
    name: string;
    tickers: {
      base: string;
      bid_ask_spread_percentage: number;
      coin_id: string;
      converted_last: {
        usd: number;
      };
      converted_volume: {
        usd: number;
      };
      cost_to_move_down_usd: number;
      cost_to_move_up_usd: number;
      market: {
        identifier: string;
        logo: string;
        name: string;
      };
      target: string;
      target_coin_id: string;
      trade_url: string;
      trust_score: string;
    }[];
  };
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export type TExchangeType = TErrorLoading & {
  data: {
    country: string;
    id: string;
    image: string;
    name: string;
    trade_volume_24h_btc: number;
    trade_volume_24h_btc_normalized: number;
    trust_score: number;
    trust_score_rank: number;
    url: string;
    year_established: number;
  }[];
};

export type TTableComponent = {
  alt: string;
  name: string;
  name_symbol?: string;
  eighthData?: string | number;
  fifthData?: string | ReactNode;
  fourthData?: string | ReactNode;
  image: string;
  id: string;
  navigateCrypto: (id: string) => void;
  ninthData?: string | number | ReactNode;
  rank: string | number;
  seventhData?: string;
  sixthData?: string | number;
  symbol?: string;
  thirdData?: string | ReactNode;
};

export type TrendingInterface = {
  trending: TTrending[];
};
