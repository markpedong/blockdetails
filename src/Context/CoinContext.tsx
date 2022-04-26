import { Container, Paper } from "@mantine/core";
import numeral from "numeral";
import React, { createContext, useState } from "react";
import { useParams } from "react-router-dom";
import { LoaderComp } from "../Components/Loader";
import { SingleCoin } from "../Config/API";
import { GlobalState } from "./GlobalContext";
import { useFetchAPISingle } from "../Hooks/useFetchAPISingle";
import { TCrypto, TCryptoDetail } from "../Type/type";
import { ErrorPage } from "../Pages/Other/Error";
import { CryptoDetail } from "../Pages/CryptoDetails/CryptoDetail";

type TCoinContext = {
  crypto: TCrypto;
  setDate: React.Dispatch<React.SetStateAction<number>>;
  date: number;
};

const CoinContext = createContext({} as TCoinContext);

export const SinglePage = () => {
  const [date, setDate] = useState(1);
  const { id } = useParams();
  const { data, error, loading } = useFetchAPISingle(
    SingleCoin(id as string)
  ) as unknown as TCryptoDetail;

  const { currency } = GlobalState();

  console.log(data);

  // prettier-ignore
  const crypto: TCrypto = {
    algo: data?.hashing_algorithm,
    ath_date: data?.market_data.ath_date[currency.toLowerCase()],
    ath_per: data?.market_data.ath_change_percentage[currency.toLowerCase()],
    ath: numeral(data?.market_data.ath[currency.toLowerCase()]).format("0,0"),
    atl_date: data?.market_data.atl_date[currency.toLowerCase()],
    atl_per: data?.market_data.atl_change_percentage[currency.toLowerCase()],
    atl: numeral(data?.market_data.atl[currency.toLowerCase()]).format("0,0"),
    categories: data?.categories,
    categories1: 'Cryptocurrency',
    categories2: 'Coins',
    circ_supply: numeral(data?.market_data.circulating_supply).format("0,0"),
    date_origin: data?.genesis_date,
    description: data?.description.en,
    forum_site: data?.links?.official_forum_url?.filter((link) => link !== ""),
    high_24: numeral(data?.market_data.high_24h[currency.toLowerCase()]).format("0,0"),
    home_site: data?.links?.homepage[0],
    id: data?.id,
    img_large: data?.image?.large,
    img_small: data?.image?.small,
    img_thumb: data?.image?.thumb,
    liq_score: data?.liquidity_score,
    low_24: numeral(data?.market_data.low_24h[currency.toLowerCase()]).format("0,0"),
    max_supply: numeral(data?.market_data.max_supply).format("0,0"),
    mcap_per: data?.market_data.market_cap_change_percentage_24h_in_currency[currency.toLowerCase()],
    mcap_rank: data?.market_cap_rank,
    mcap: numeral(data?.market_data.market_cap[currency.toLowerCase()]).format("0,0"),
    name: data?.name,
    price_change: data?.market_data.price_change_percentage_24h_in_currency[currency.toLowerCase()],
    price: numeral(data?.market_data.current_price[currency.toLowerCase()]).format("0,0.00"),
    rank: data?.coingecko_rank,
    reddit: data?.links.subreddit_url,
    scan_site: data?.links?.blockchain_site?.filter((link) => link !== ""),
    source_code: data?.links?.repos_url?.github.filter((link) => link !== ""),
    symbol: data?.symbol,
    total_supply: numeral(data?.market_data.total_supply).format("0,0"),
    valuation: numeral(data?.market_data.fully_diluted_valuation[currency.toLowerCase()]).format("0,0"),
    volume: numeral(data?.market_data.total_volume[currency.toLowerCase()]).format("0,0"),
    volumetomcap: data?.market_data?.total_volume[currency.toLowerCase()] / data?.market_data?.market_cap[currency.toLowerCase()],
  };

  return error ? (
    <>
      <ErrorPage />
    </>
  ) : loading ? (
    <Paper sx={{ borderRadius: 0 }}>
      <Container
        sx={{
          blockSize: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoaderComp />
      </Container>
    </Paper>
  ) : (
    <CoinContext.Provider value={{ crypto, date, setDate }}>
      <CryptoDetail />
    </CoinContext.Provider>
  );
};

export const useCoinContext = () => React.useContext(CoinContext);
