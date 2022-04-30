import { Container, Paper } from "@mantine/core";
import React, { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { LoaderComp } from "../Components/Loader";
import { Exchange_DETAILS, Exchange_PAPRIKA } from "../Config/API";
import { useFetchAPISingle } from "../Hooks/useFetchAPISingle";
import { ExchangeDetail } from "../Pages/Exchanges/ExchangeDetail";
import { ErrorPage } from "../Pages/Other/Error";
import {
  ExchangeMerged,
  FetchedData,
  matchData,
  Paprika_Exchange,
  TExchangeDetail,
} from "../Type/type";

const ExchangeContextInterface = createContext({} as TExchangeDetail);

export const SingleExchangeDetail = () => {
  const { id } = useParams();
  const { data: coin_paprika } = useFetchAPISingle(
    Exchange_PAPRIKA()
  ) as unknown as Paprika_Exchange;

  const { data, error, loading } = useFetchAPISingle(
    Exchange_DETAILS(id as string)
  ) as unknown as FetchedData;

  const filteredExchanges = coin_paprika?.filter(
    (exchange) => exchange.active === true && exchange.website_status === true
  );

  const paprikaData = filteredExchanges?.find(
    (paprika) => paprika.id === id || paprika.name === data?.name
  ) as matchData;

  const exchange: ExchangeMerged = {
    confidence_score: paprikaData?.confidence_score,
    country: data?.country,
    currencies: paprikaData?.currencies,
    description: paprikaData?.description,
    fb_url: data?.facebook_url,
    fiats: paprikaData?.fiats,
    id: paprikaData?.id,
    image: data?.image,
    name: data?.name,
    links: {
      twitter: paprikaData?.links?.twitter,
      website: paprikaData?.links?.website,
    },
    markets: paprikaData?.markets,
    other_url1: data?.other_url_1,
    other_url2: data?.other_url_2,
    rank: data?.trust_score_rank,
    score: data?.trust_score,
    reddit: data?.reddit_url,
    sessionPerMonth: paprikaData?.sessions_per_month,
    status: data?.status_updates,
    tickers: data?.tickers,
    url: data?.url,
    volume_btc: data?.trade_volume_24h_btc,
    volume24h: paprikaData?.quotes.USD.adjusted_volume_24h,
    volume30d: paprikaData?.quotes.USD.adjusted_volume_30d,
    volume7d: paprikaData?.quotes.USD.adjusted_volume_7d,
    web_Status: paprikaData?.website_status,
    year: data?.year_established,
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
    <ExchangeContextInterface.Provider value={{ exchange }}>
      <ExchangeDetail />
    </ExchangeContextInterface.Provider>
  );
};

export const useExchangeContext = () => {
  return useContext(ExchangeContextInterface);
};
