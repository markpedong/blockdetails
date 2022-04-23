import { Container, Paper } from "@mantine/core";
import React from "react";
import { Carousel } from "./Carousel";

export const Home = () => {
  return (
    <Paper
      sx={{
        borderRadius: 0,
      }}
    >
      <Container size="xl" px={"xs"}>
        <Carousel />
      </Container>
    </Paper>
  );
};
