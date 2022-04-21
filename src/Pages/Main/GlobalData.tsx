import { Container, Grid, MediaQuery } from "@mantine/core";
import React from "react";
import { GlobalState } from "../../Context/GlobalContext";

export const GlobalData = () => {
  const { currency, setCurrency, global } = GlobalState();
  console.log(global);

  return (
    <>
      <MediaQuery query="(max-width: 992px)" styles={{ display: "none" }}>
        <Container size="lg" px={0}>
          <Grid columns={24} gutter="xs" grow>
            <Grid.Col md={4}>1</Grid.Col>
            <Grid.Col md={4}>2</Grid.Col>
            <Grid.Col md={4}>3</Grid.Col>
            <Grid.Col md={4}>3</Grid.Col>
            <Grid.Col md={4}>3</Grid.Col>
            <Grid.Col md={4}>3</Grid.Col>
          </Grid>
        </Container>
      </MediaQuery>
    </>
  );
};
