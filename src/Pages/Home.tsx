import { Container, Paper } from "@mantine/core";
import React from "react";
import { TableContext } from "../Context/TableContext";
import { Carousel } from "./Home/Carousel";
import { CryptoTable } from "./Home/Table";
import { ShowRow } from "./Home/ShowRow";
import { TodaysCrypto } from "./Home/TodaysCrypto";
import { Trending } from "./Home/Trending";
import PaginationComp from "./Home/PaginationComp";

export const Home = () => {
  return (
    <Paper
      sx={{
        borderRadius: 0,
      }}
      className="container__main"
    >
      <Container size="xl" px={"xs"}>
        <Carousel />
        <TodaysCrypto />
        {/* <Trending /> */}
        <TableContext>
          <CryptoTable />
          <PaginationComp />
        </TableContext>
      </Container>
    </Paper>
  );
};
