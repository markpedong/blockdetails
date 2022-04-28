import { Container, Paper } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { CoinChart } from "../../Config/API";
import { CoinChartData } from "../../Context/ChartContext";
import { useCoinContext } from "../../Context/CoinContext";
import { GlobalState } from "../../Context/GlobalContext";
import { TrendingState } from "../../Context/TrendingCoinContext";
import { useFetchAPISingle } from "../../Hooks/useFetchAPISingle";

export const PeopleAlsoWatch = () => {
  const { trending } = TrendingState();
  const { currency } = GlobalState();

  return (
    <Container fluid px={0}>
      {trending?.map((coin) => {
        return <Paper key={coin.name}>{coin.name}</Paper>;
      })}
    </Container>
  );
};
