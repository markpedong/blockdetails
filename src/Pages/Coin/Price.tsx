import {
  Divider,
  Grid,
  Menu,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { MarketData } from "../../Components/MarketData";
import { useCoinContext } from "../../Context/CoinContext";
import { GlobalState } from "../../Context/GlobalContext";
import {
  LowHigh,
  LowHighSpan,
  PriceChange,
  WhiteText,
} from "../../StyledComponents/StyledCrypto";

export const Price = () => {
  const { crypto } = useCoinContext();
  const { colorScheme } = useMantineColorScheme();
  const { symbol } = GlobalState();
  const priceProfit = crypto.price_per >= 0.0;
  const colorProfit = priceProfit ? "#16c784" : "#ea3943";
  const profitMCAP = crypto.mcap_per >= 0.0;

  return (
    <>
      {/* Price Header */}
      <div>
        <Text size="xs" weight="bold">
          {crypto.name} Price (
          {<span style={{ textTransform: "uppercase" }}>{crypto.symbol}</span>})
        </Text>
      </div>
      {/* Price and Price Change */}
      <div
        style={{
          textTransform: "uppercase",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <WhiteText color={colorScheme} style={{ fontSize: 30 }}>
          {symbol} {crypto.price}
        </WhiteText>
        <PriceChange profit={colorProfit} size="sm">
          {priceProfit ? (
            <AiFillCaretUp size={15} />
          ) : (
            <AiFillCaretDown size={15} />
          )}{" "}
          {crypto.price_per?.toFixed(2).replace("-", "")} %
        </PriceChange>
      </div>
      {/* High and Low 24h */}
      <Grid columns={12} pt="md">
        <Grid.Col
          xs={6}
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: "1rem",
          }}
        >
          <LowHigh>
            Low:{" "}
            <LowHighSpan color={colorScheme}>
              {symbol} {crypto.low_24}
            </LowHighSpan>
          </LowHigh>
          <LowHigh>
            High:{" "}
            <LowHighSpan color={colorScheme}>
              {symbol} {crypto.high_24}
            </LowHighSpan>
          </LowHigh>
          <Menu>
            <Menu.Item onClick={(e: any) => console.log(e)} value={1}>
              24h Low/ high
            </Menu.Item>
            <Menu.Item onClick={(e: any) => console.log(e)} value={7}>
              7d Low/ high
            </Menu.Item>
          </Menu>
        </Grid.Col>
      </Grid>
      <Divider my="sm" />
      {/* Market Data */}
      <Grid columns={12}>
        <MarketData
          symbol={symbol}
          title="Market Cap:"
          data={crypto.mcap}
          profit={profitMCAP}
          dataPer={crypto.mcap_per}
        />
        <MarketData
          symbol={symbol}
          title="Fully Diluted Market Cap:"
          data={crypto.valuation}
        />
        <MarketData
          symbol={symbol}
          title="Volume:"
          data={crypto.volume}
          supply={true}
          dataMCAP={crypto.volumetomcap}
        />
        <MarketData
          title="Circulating Supply"
          data={crypto.circ_supply}
          maxSupply={true}
        />
      </Grid>
    </>
  );
};
