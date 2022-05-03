import { Container, Paper } from "@mantine/core";
import React from "react";
import { TrendingCoinContext } from "../Context/TrendingCoinContext";
import { Carousel } from "./Main/Carousel";
import { CryptoTable } from "./Main/Table";
import { TodaysCrypto } from "./Main/TodaysCrypto";

export const Home = () => {
  return (
    <Paper
      sx={{
        borderRadius: 0,
      }}
      className="container__main"
    >
      <Container size="xl" px={"xs"}>
        <TrendingCoinContext>
          <Carousel />
          <TodaysCrypto />
          {/* <Trending /> */}
          <CryptoTable />
        </TrendingCoinContext>
      </Container>
    </Paper>
  );
};
