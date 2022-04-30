import {
  Button,
  Collapse,
  Container,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { ReaderIcon } from "@radix-ui/react-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { SingleCoin } from "../../Config/API";
import { numberWithCommas } from "../../Config/Function";
import { GlobalState } from "../../Context/GlobalContext";
import { ProfitChange } from "../../StyledComponents/StyledCarousel";
import {
  Number,
  TodayContainer,
  TodayTitle,
} from "../../StyledComponents/StyledTodayCrypto";
var numeral = require("numeral");

type Bitcoin = {
  market_data: {
    current_price: {
      [index: string]: number;
    };
  };
};

export const TodaysCrypto = () => {
  const { colorScheme } = useMantineColorScheme();
  const { symbol, global, currency } = GlobalState();
  const [opened, setOpen] = useState(false);
  const [bitcoin, setBitcoin] = useState({} as Bitcoin);
  const profit = global.mcap_change >= 0.0;
  const defi_per = (global.defi_vol / global.volume) * 100;

  const FetchBitcoin = async () => {
    const { data } = await axios.get(SingleCoin("bitcoin"));
    setBitcoin(data);
  };
  useEffect(() => {
    FetchBitcoin();
  }, [currency]);

  const bitcoin_price =
    bitcoin?.market_data?.current_price[currency.toLowerCase()];

  return (
    <TodayContainer
      style={{
        backgroundColor: "inherit",
      }}
    >
      <TodayTitle theme={colorScheme}>
        Today's Cryptocurrency Market Cap
      </TodayTitle>
      <Container fluid px={0} sx={{ display: "flex", gap: "1rem" }}>
        <Text size="sm">
          The Global Crypto Market cap is{" "}
          <Number>
            {symbol} {numeral(global.mcap).format("(0.00a)")}.
          </Number>
          <ProfitChange profit={profit}>
            {profit ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
            {global.mcap_change?.toFixed(2)?.replace("-", "")} %
          </ProfitChange>{" "}
          {profit ? "increase" : "decrease"} over the last day.
        </Text>
        <Button
          color={colorScheme === "dark" ? "indigo" : ""}
          leftIcon={<ReaderIcon />}
          compact
          uppercase
          onClick={() => setOpen((o) => !o)}
        >
          Read More
        </Button>
      </Container>
      <Collapse in={opened}>
        <Text pt={"sm"} size="md" color={colorScheme === "dark" ? "white" : ""}>
          The total crypto market volume over the last 24 hours is{" "}
          <Number>
            {symbol} {numeral(global.volume).format("(0.00a)")}
          </Number>{" "}
          . The total volume in DeFi is currently{" "}
          <Number>
            {symbol} {numeral(global.defi_vol).format("(0.00a)")}
          </Number>
          , which is <Number>{defi_per?.toFixed(2)} %</Number> of the total
          crypto market 24-hour volume. DeFi Dominance is{" "}
          <Number>{global.defi?.toFixed(2)} %</Number>, and the Top Coin in DeFi
          is Currently {global.top_name} with{" "}
          <Number>{global.defi_top?.toFixed(2)} %</Number> of dominance.
        </Text>
        <Text pt={"sm"}>
          Bitcoin's price is currently{" "}
          <Number>
            {symbol} {numberWithCommas(bitcoin_price)}
          </Number>
          .
        </Text>
        <Text>
          Bitcoin’s dominance is currently{" "}
          <Number>{global.btc?.toFixed(2)} %</Number>
        </Text>
      </Collapse>
    </TodayContainer>
  );
};
