import {
  Container,
  Grid,
  Paper,
  SimpleGrid,
  Tabs,
  TabsProps,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import { chartDays } from "../../../Config/Variable";
import { ChartState, useChartContext } from "../../../Context/ChartContext";
import { useCoinContext } from "../../../Context/CoinContext";
import { GlobalState } from "../../../Context/GlobalContext";
import {
  SpanUpperCase,
  StyledDesc,
  StyledDesc2,
} from "../../../Styled Components/StyledCrypto";
import { StyledPriceTabs } from "../../../Theme/CreateStyles/CryptoDetails";
import { MarketCapChart } from "../Chart/MarketCapChart";
import { PriceChart } from "../Chart/PriceChart";
import { VolumeChart } from "../Chart/VolumeChart";
import parse from "html-react-parser";

export const Overview = () => {
  const { crypto } = useCoinContext();
  const { currency, symbol } = GlobalState();
  const { setDays } = useChartContext();
  const { colorScheme } = useMantineColorScheme();

  console.log(crypto);
  const upDown = crypto.price_change > 0.0 ? "up" : "down";
  const cryptoMarkets = crypto.tickers
    ?.map((ticker) => ticker.market.name)
    .filter(
      (item, index) =>
        crypto.tickers?.map((name) => name.market.name).indexOf(item) === index
    )
    .slice(0, 5);

  const description = crypto?.description?.split(". ");
  console.log(description);

  return (
    <Container fluid>
      <Text size="lg" weight="bold" pb="xl">
        {crypto.name} to {currency} Chart
      </Text>
      <ChartState>
        <Grid>
          <Grid.Col xs={8}>
            {/* Tabs for Price, Market Cap, Volume */}
            <StyledPriceTabs initialTab={0} mb="xl">
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
            {/* Live Data */}
            <Paper>
              <StyledDesc color={colorScheme} pb="lg" weight="bold">
                <SpanUpperCase>{crypto.symbol}</SpanUpperCase> Price Live Data
              </StyledDesc>
              <Text>
                The live {crypto.name} price today is {symbol}
                {crypto.price} {currency} with a 24-hour trading volume of
                {symbol}
                {crypto.volume} {currency}. We update our{" "}
                <SpanUpperCase>{crypto.symbol}</SpanUpperCase> to {currency}{" "}
                price in real-time. {crypto.name} is {upDown}{" "}
                {crypto.price_change?.toFixed(2).replace("-", "")}% in the last
                24 hours. The current ranking is #{crypto.mcap_rank}, with a
                live market cap of {symbol}
                {crypto.mcap} {currency}. It has a circulating supply of{" "}
                {crypto.circ_supply}{" "}
                <SpanUpperCase>{crypto.symbol}</SpanUpperCase> coins and a max.
                supply of {crypto.total_supply}{" "}
                <SpanUpperCase>{crypto.symbol}</SpanUpperCase> coins.
                <br /> <br /> If you would like to know where to buy{" "}
                {crypto.name} at the current rate, the top cryptocurrency
                exchanges for trading in {crypto.name}
                stock are currently {cryptoMarkets
                  ?.slice(0, -1)
                  .join(", ")} and {cryptoMarkets?.slice(4)}. You can find
                others listed on our crypto exchanges page.
              </Text>
            </Paper>
            {/* What is  */}
            <Paper>
              <StyledDesc2 py="xl" weight="bold">
                What is <SpanUpperCase>({crypto.symbol})</SpanUpperCase>?
              </StyledDesc2>
              {
                // <div
                //   className="crypto_detail"
                //   dangerouslySetInnerHTML={{ __html: crypto.description }}
                // ></div>

                description?.map((desc, index) => (
                  <Text key={index} pb="sm">
                    {parse(desc)}.
                    <br />
                  </Text>
                ))
              }
            </Paper>
          </Grid.Col>
          <Grid.Col xs={4}>2</Grid.Col>
        </Grid>
      </ChartState>
    </Container>
  );
};
