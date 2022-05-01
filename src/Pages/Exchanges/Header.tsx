import { Button, Collapse, Grid, Text } from "@mantine/core";
import React, { useState } from "react";

export const Header = () => {
  const [opened, setOpen] = useState(false);

  return (
    <Grid>
      <Grid.Col xs={7}>
        <Text size="xl" weight="bolder" pb="lg">
          Top Cryptocurrency Spot Exchanges
        </Text>
        <Text size="sm" weight="normal" pb="lg">
          CoinMarketCap and Coingecko ranks and scores exchanges based on
          traffic, liquidity, trading volumes, and confidence in the legitimacy
          of trading volumes reported.{" "}
          <Button onClick={() => setOpen((o) => !o)} variant="light" compact>
            Read More
          </Button>
        </Text>
        <Collapse in={opened}>
          <Text size="sm" weight="normal" pb="lg">
            They now track 500+ spot exchanges with a total 24h volume of
            ₱14.76T. For more info on exchange ranking, click here .
          </Text>
        </Collapse>
      </Grid.Col>
    </Grid>
  );
};
