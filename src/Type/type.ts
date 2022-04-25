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

type CryptoTable = {
  circulating_supply: number;
  current_price: number;
  id: string;
  image: string;
  market_cap: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number;
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
      market_cap: { [index: string]: string };
      market_cap_change_percentage_24h_in_currency: { [index: string]: string };
      market_cap_rank: number;
      max_supply: number;
      price_change_percentage_24h_in_currency: { [index: string]: string };
      total_supply: number;
      total_volume: { [index: string]: string };
    };
    name: string;
    symbol: string;
  };
};
