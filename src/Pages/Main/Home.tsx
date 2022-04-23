import { Container, Paper } from "@mantine/core";
import React from "react";
import { Carousel } from "./Carousel";
import { TodaysCrypto } from "./TodaysCrypto";
import "../../Styles/App.css";

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
      </Container>
    </Paper>
  );
};
