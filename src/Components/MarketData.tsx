import { Container, Grid, Text, useMantineColorScheme } from "@mantine/core";
import React from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useCoinContext } from "../Context/CoinContext";
import { ProfitChange } from "../StyledComponents/StyledCarousel";

type Props = {
  profit?: boolean;
  supply?: boolean;
  dataPer?: number;
  data: number | string;
  title: string;
  dataMCAP?: number;
  symbol?: string;
  maxSupply?: boolean;
};

export const MarketData = ({
  profit,
  dataPer,
  data,
  title,
  supply,
  dataMCAP,
  symbol,
  maxSupply,
}: Props) => {
  const { colorScheme } = useMantineColorScheme();
  const darkColor = colorScheme === "dark" ? "#5c5f66" : "#ced4da";
  const { crypto } = useCoinContext();

  return (
    <Grid.Col
      xs={3}
      style={{
        borderInlineEnd: `1px solid ${darkColor}`,
        paddingBlockStart: "1.5rem",
      }}
    >
      <Text size="xs" weight="bold" pb={5}>
        {title}
      </Text>
      <Text size="xs" weight="bolder" pb={5}>
        {data === 0 ? (
          "N/A"
        ) : (
          <>
            {symbol} {data}
          </>
        )}
      </Text>
      {profit ? (
        <Text size="xs">
          <ProfitChange profit={profit}>
            {profit ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
            {dataPer?.toFixed(2).replace("-", "")} %
          </ProfitChange>
        </Text>
      ) : (
        ""
      )}
      {supply ? (
        <>
          <Text pt="lg" size="xs" weight="bold">
            Volume / MarketCap
          </Text>
          <Text size="xs" weight="bold">
            {dataMCAP?.toFixed(2)}
          </Text>
        </>
      ) : (
        ""
      )}
      {maxSupply ? (
        <div style={{ fontFamily: "Inter" }}>
          <Container
            pt="lg"
            px={0}
            fluid
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Text size="xs" weight="bold">
              Max Supply
            </Text>
            <Text size="xs" weight="bold">
              {crypto.circ_supply}
            </Text>
          </Container>
          <Container
            pt="lg"
            px={0}
            fluid
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Text size="xs" weight="bold">
              Total Supply
            </Text>
            <Text size="xs" weight="bold">
              {+crypto.total_supply === 0 ? "∞" : crypto.total_supply}
            </Text>
          </Container>
        </div>
      ) : (
        ""
      )}
    </Grid.Col>
  );
};
