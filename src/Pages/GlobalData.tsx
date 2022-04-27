import {
  ActionIcon,
  Container,
  Grid,
  MediaQuery,
  Paper,
  Select,
  useMantineColorScheme,
} from "@mantine/core";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import React from "react";
import { GlobalHeader } from "../Components/GlobalHeader";
import { numberWithCommas } from "../Config/Function";
import { GlobalState } from "../Context/GlobalContext";

export const GlobalData = () => {
  const { setCurrency, global, symbol } = GlobalState();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <MediaQuery query="(max-width: 1200px)" styles={{ display: "none" }}>
      <Paper
        sx={{
          marginBlock: "0.3rem",
          fontSize: 11,
          fontWeight: 600,
          borderRadius: 0,
          fontFamily: "Inter",
        }}
      >
        <Container size="xl" px={"xs"}>
          <Grid align="center" columns={24} justify="center">
            <Grid.Col lg={2.5}>
              <GlobalHeader title="Cryptos:" data={global?.active} />
            </Grid.Col>
            <Grid.Col lg={2.5}>
              <GlobalHeader title="Exchanges:" data={global?.market} />
            </Grid.Col>
            <Grid.Col lg={4.7}>
              <GlobalHeader
                title="Market Cap:"
                data={numberWithCommas(global?.mcap)}
                symbol={symbol}
              />
            </Grid.Col>
            <Grid.Col lg={4.3}>
              <GlobalHeader
                title="24h Vol:"
                data={numberWithCommas(global?.volume)}
                symbol={symbol}
              />
            </Grid.Col>
            <Grid.Col lg={4.5}>
              <GlobalHeader
                title="Dominance:"
                data={global?.btc?.toFixed(2)}
                percentage="%"
              />
              <GlobalHeader data={global?.eth?.toFixed(2)} percentage="%" />
            </Grid.Col>
            <Grid.Col offsetLg={2.7} lg={2}>
              <Select
                placeholder="Change Currency"
                onChange={(e) => setCurrency(e as string)}
                defaultValue={"usd"}
                size="xs"
                data={[
                  { value: "usd", label: "USD" },
                  { value: "php", label: "PHP" },
                  { value: "jpy", label: "JPY" },
                  { value: "eur", label: "EUR" },
                ]}
              />
            </Grid.Col>
            <Grid.Col lg={0.8}>
              <ActionIcon
                color={dark ? "gray" : "blue"}
                onClick={() => toggleColorScheme()}
                size="sm"
                variant="filled"
              >
                {dark ? <SunIcon fontSize={18} /> : <MoonIcon fontSize={18} />}
              </ActionIcon>
            </Grid.Col>
          </Grid>
        </Container>
      </Paper>
    </MediaQuery>
  );
};
