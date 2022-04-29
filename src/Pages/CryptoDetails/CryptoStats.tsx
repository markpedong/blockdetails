import { Text, useMantineColorScheme } from "@mantine/core";
import React from "react";
import { StatsComp } from "../../Components/StatsComp";
import { useCoinContext } from "../../Context/CoinContext";
import { GlobalState } from "../../Context/GlobalContext";
import {
  SpanUpperCase,
  StyledContainer,
} from "../../StyledComponents/StyledCrypto";

export const CryptoStats = () => {
  const { colorScheme } = useMantineColorScheme();
  const { crypto } = useCoinContext();
  const { symbol } = GlobalState();

  const profit = crypto.price_per >= 0.0;
  const mcap = crypto.mcap_per >= 0.0;
  const price7d = crypto.price_7d >= 0.0;
  const price30d = crypto.price_30d >= 0.0;
  const price1yr = crypto.price_1yr >= 0.0;

  return (
    <StyledContainer color={colorScheme} fluid>
      <Text size="xl" weight="bolder" mb="xl">
        <SpanUpperCase>{crypto.symbol}</SpanUpperCase> Price Statistics
      </Text>
      <Text size="xs" weight="bolder" mb="xs">
        {crypto.name} Price Today
      </Text>
      <StatsComp
        name={`${crypto.name} Price`}
        number={crypto.price}
        symbol={symbol}
      />
      <StatsComp
        name="Price Change"
        time="24h"
        symbol={symbol}
        number={crypto.price_change}
        profit={profit}
        perChange={crypto.price_per?.toFixed(2)}
      />
      <StatsComp
        name="24h Low / 24h High"
        symbol={symbol}
        high24h={crypto.high_24}
        low24h={crypto.low_24}
      />
      <StatsComp
        name="Trading Volume"
        time="24h"
        number={crypto.volume}
        symbol={symbol}
      />
      <StatsComp name="Market Rank" number={`# ${crypto.mcap_rank}`} />
      <Text size="xs" weight="bolder" pt="xl" mb="xs">
        {crypto.name} Market Cap
      </Text>
      <StatsComp
        name="Market Cap"
        symbol={symbol}
        number={crypto.mcap}
        profit={mcap}
        perChange={crypto.mcap_per?.toFixed(2)}
      />
      <StatsComp
        name="Fully Diluted Market Cap"
        symbol={symbol}
        number={crypto.valuation}
      />
      <Text size="xs" weight="bolder" pt="xl" mb="xs">
        {crypto.name} Price History
      </Text>
      <StatsComp
        name="7d Price Percentage Change"
        symbol={symbol}
        perChange={crypto.price_7d?.toFixed(2)?.replace("-", "")}
        profit={price7d}
      />
      <StatsComp
        name="30d Price Percentage Change"
        symbol={symbol}
        perChange={crypto.price_30d?.toFixed(2)?.replace("-", "")}
        profit={price30d}
      />
      <StatsComp
        name="52w Price Percentage Change"
        symbol={symbol}
        perChange={crypto.price_1yr?.toFixed(2)?.replace("-", "")}
        profit={price1yr}
      />
      <StatsComp name="All Time High" symbol={symbol} number={crypto.ath} />
      <StatsComp name="All Time Low" symbol={symbol} number={crypto.atl} />
      <Text size="xs" weight="bolder" pt="xl" mb="xs">
        {crypto.name} Supply
      </Text>
      <StatsComp
        name="Circulating Supply"
        number={`${crypto.circ_supply} ${crypto.symbol}`}
      />
      <StatsComp
        name="Total Supply"
        number={`${crypto.circ_supply} ${crypto.symbol}`}
      />
      <StatsComp name="Max Supply" number={crypto.total_supply} />
    </StyledContainer>
  );
};
