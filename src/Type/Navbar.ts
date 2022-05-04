import { TErrorLoading } from "./type";

export type SearchData = {
  coins: {
    id: string;
    name: string;
    symbol: string;
    large: string;
    thumb: string;
    market_cap_rank: number;
  }[];
  exchanges: {
    id: string;
    name: string;
    large: string;
    thumb: string;
    market_type: number;
  }[];
};

export type TSearch = TErrorLoading & {
  data: SearchData;
};
