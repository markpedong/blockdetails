import { Container, SimpleGrid, Tabs, TabsProps, Text } from "@mantine/core";
import React from "react";
import { ChartState } from "../../../Context/ChartContext";
import { useCoinContext } from "../../../Context/CoinContext";
import { GlobalState } from "../../../Context/GlobalContext";
import { StyledPriceTabs } from "../../../Theme/CreateStyles/CryptoDetails";
import { MarketCapChart } from "../Chart/MarketCapChart";
import { PriceChart } from "../Chart/PriceChart";
import { VolumeChart } from "../Chart/VolumeChart";

export const Overview = () => {
  const { crypto } = useCoinContext();
  const { currency } = GlobalState();
  return (
    <Container fluid>
      <Text size="lg" weight="bold" pb="xl">
        {crypto.name} to {currency} Chart
      </Text>
      <SimpleGrid cols={2} spacing="sm">
        <div>
          <ChartState>
            <StyledPriceTabs initialTab={0}>
              <Tabs.Tab label="Price">
                <PriceChart />
              </Tabs.Tab>
              <Tabs.Tab label="Market Cap">
                <MarketCapChart />
              </Tabs.Tab>
              <Tabs.Tab label="Volume">
                <VolumeChart />
              </Tabs.Tab>
            </StyledPriceTabs>
          </ChartState>
        </div>
        <div></div>
      </SimpleGrid>
    </Container>
  );
};
