import { ActionIcon, Grid, Paper, Text } from "@mantine/core";
import React from "react";
import { useExchangeContext } from "../../Context/ExchangeContext";
import numeral from "numeral";
import { AiFillRead } from "react-icons/ai";
import { StyledCol } from "../../StyledComponents/StyledExchange";
import { GrayContainer } from "../../StyledComponents/StyledCrypto";

export const Market = () => {
  const { exchange } = useExchangeContext();
  const volume = [
    {
      name: "Volume (24h)",
      number: numeral(exchange.volume7d).format("0,0.00"),
    },
    {
      name: "Volume (30d)",
      number: numeral(exchange.volume30d).format("0,0.00"),
    },
  ];
  const market = [
    {
      name: "Currency",
      number: numeral(exchange.currencies).format("0,0"),
    },
    {
      name: "Market",
      number: numeral(exchange.markets).format("0,0"),
    },
  ];

  const score = [
    {
      name: "Confidence Score",
      number: numeral(exchange.confidence_score).format("0,0"),
    },
    {
      name: "Score",
      number: numeral(exchange.score).format("0,0"),
    },
  ];

  const other = [
    {
      icon: <AiFillRead fontSize={23} />,
      name: "Read More!",
      href: exchange.other_url1,
    },
    {
      name: "Read More!",
      icon: <AiFillRead fontSize={23} />,
      href: exchange.other_url2,
    },
  ];

  return (
    <Grid>
      <StyledCol xs={12}>
        {volume?.map((vol) =>
          vol.number === "0.00" ? (
            ""
          ) : (
            <Paper key={vol.name} pt="xl">
              <Text size="sm" weight="bold">
                {vol.name}
              </Text>
              <Text size="xs" weight="bold">
                $ {vol.number}
              </Text>
            </Paper>
          )
        )}
      </StyledCol>
      <StyledCol xs={12}>
        {market?.map((mark) =>
          mark.number === "0" ? (
            ""
          ) : (
            <Paper key={mark.name}>
              <Text size="sm" weight="bold">
                {mark.name}
              </Text>
              <Text size="xs" weight="bold">
                {mark.number}
              </Text>
            </Paper>
          )
        )}
      </StyledCol>
      <StyledCol xs={12}>
        {score?.map((point) =>
          point.number === "0" ? (
            ""
          ) : (
            <Paper key={point.name}>
              <Text size="sm" weight="bold">
                {point.name}
              </Text>
              <Text size="xs" weight="bold">
                {point.number}
              </Text>
            </Paper>
          )
        )}
      </StyledCol>
      <StyledCol xs={12}>
        {other?.map((link, index) =>
          !link.href ? (
            ""
          ) : (
            <GrayContainer key={index} style={{ paddingTop: "0.5rem" }}>
              <ActionIcon>{link.icon}</ActionIcon>
              <Text
                style={{ color: "blue" }}
                component="a"
                href={link.href}
                target="_blank"
                weight={400}
                size="md"
              >
                {link.name}
              </Text>
            </GrayContainer>
          )
        )}
      </StyledCol>
    </Grid>
  );
};
