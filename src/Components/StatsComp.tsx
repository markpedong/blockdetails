import {
  Container,
  Divider,
  Paper,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { GlobalState } from "../Context/GlobalContext";
import { ProfitChange } from "../StyledComponents/StyledCarousel";
import {
  GrayText,
  PriceChange,
  StyledNum,
  StyledText,
} from "../StyledComponents/StyledCrypto";

type Props = {
  name?: string;
  number?: string | number;
  symbol?: string;
  profit?: boolean;
  perChange?: number | string;
  time?: string;
  high24h?: string;
  low24h?: string;
  ath?: string;
  date?: string;
};

export const StatsComp = ({
  name,
  number,
  symbol,
  profit,
  perChange,
  time,
  high24h,
  low24h,
  ath,
  date,
}: Props) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Divider />
      <Container
        my="xs"
        fluid
        px={0}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        {name && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <StyledText color={colorScheme}>{name}</StyledText>
            {time && <GrayText color={colorScheme}>{time}</GrayText>}
          </div>
        )}

        {ath && date && (
          <div style={{ display: "block" }}>
            <StyledText color={colorScheme}>{ath}</StyledText>
            <StyledText color={colorScheme}>{date}</StyledText>
          </div>
        )}

        <div
          style={{
            display: "flex",
            fontSize: "0.9rem",
            flexDirection: "column",
            justifyContent: "end",
          }}
        >
          {number === "0" ? (
            <StyledNum color={colorScheme}>N/A</StyledNum>
          ) : (
            number && (
              <StyledNum color={colorScheme}>
                {symbol} {number}
              </StyledNum>
            )
          )}
          {perChange && (
            <ProfitChange profit={profit}>
              {profit ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
              {perChange.toString().replace("-", "")} %
            </ProfitChange>
          )}
          {low24h && high24h && (
            <>
              <StyledNum color={colorScheme}>
                {symbol} {high24h} /
              </StyledNum>
              <StyledNum color={colorScheme}>
                {symbol} {low24h}
              </StyledNum>
            </>
          )}
        </div>
      </Container>
    </>
  );
};
