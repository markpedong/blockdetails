import { Container, Paper } from "@mantine/core";
import React from "react";
import { TableContext } from "../Context/TableContext";
import { TrendingCoinContext } from "../Context/TrendingCoinContext";
import { Carousel } from "./Home/Carousel";
import { PaginationComp } from "./Home/PaginationComp";
import { CryptoTable } from "./Home/Table";
import { TodaysCrypto } from "./Home/TodaysCrypto";

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
          <TableContext>
            <CryptoTable />
            <PaginationComp />
          </TableContext>
        </TrendingCoinContext>
      </Container>
    </Paper>
  );
};
