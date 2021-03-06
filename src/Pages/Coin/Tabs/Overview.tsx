import {
  Container,
  Grid,
  MediaQuery,
  Paper,
  Tabs,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import parse from "html-react-parser";
import React from "react";
import { ChartState } from "../../../Context/ChartContext";
import { useCoinContext } from "../../../Context/CoinContext";
import { GlobalState } from "../../../Context/GlobalContext";
import { TrendingCoinContext } from "../../../Context/TrendingCoinContext";
import {
  SpanUpperCase,
  StyledDesc,
  StyledDesc2,
} from "../../../StyledComponents/StyledCrypto";
import { StyledPriceTabs } from "../../../Theme/CreateStyles/CryptoDetails";
import { PeopleAlsoWatch } from "../AlsoWatch";
import { MarketCapChart } from "../Chart/MarketCap";
import { PriceChart } from "../Chart/Price";
import { VolumeChart } from "../Chart/Volume";
import { CryptoMarket } from "../CoinMarkets";
import { CryptoStats } from "../Statistics";
import { TrendingCoins } from "../TrendingCoins";

export const Overview = () => {
  const { crypto } = useCoinContext();
  const { currency, symbol } = GlobalState();
  const { colorScheme } = useMantineColorScheme();

  const upDown = crypto.price_per > 0.0 ? "up" : "down";
  const cryptoMarkets = crypto.tickers
    ?.map((ticker) => ticker.market.name)
    .filter(
      (item, index) =>
        crypto.tickers?.map((name) => name.market.name).indexOf(item) === index
    )
    .slice(0, 5);

  const description = crypto?.description?.split(". ");

  return (
    <Container fluid px={0}>
      <Text size="lg" weight="bold" pb="xl">
        {crypto.name} to {currency} Chart
      </Text>
      <ChartState>
        <Grid>
          <Grid.Col xs={8}>
            {/* Tabs for Price, Market Cap, Volume */}
            <StyledPriceTabs initialTab={0} mb="xl">
              <Tabs.Tab label="Price" children={<PriceChart />} />
              <Tabs.Tab label="Market Cap" children={<MarketCapChart />} />
              <Tabs.Tab label="Volume" children={<VolumeChart />} />
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
                {crypto.price_per?.toFixed(2).replace("-", "")}% in the last 24
                hours. The current ranking is #{crypto.mcap_rank}, with a live
                market cap of {symbol}
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
              {description?.map((desc, index) => (
                <Text key={index} pb="sm">
                  {parse(desc)}.
                  <br />
                </Text>
              ))}
            </Paper>
          </Grid.Col>
          <Grid.Col xs={4}>
            <CryptoStats />
            <TrendingCoins />
          </Grid.Col>
        </Grid>
        <Container fluid px={0}>
          <StyledDesc2 weight="bold" style={{ marginTop: "3rem" }}>
            {crypto.name} Markets
          </StyledDesc2>
          <CryptoMarket />
        </Container>

        <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
          <Container fluid px={0} style={{ marginBlockStart: "3rem" }}>
            <StyledDesc2 weight="bold">People Also Watch</StyledDesc2>
            <TrendingCoinContext>
              <PeopleAlsoWatch />
            </TrendingCoinContext>
          </Container>
        </MediaQuery>
      </ChartState>
    </Container>
  );
};
