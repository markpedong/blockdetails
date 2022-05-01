import {
  Container,
  Divider,
  Grid,
  Image,
  Paper,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import numeral from "numeral";
import { SingleCoin } from "../../Config/API";
import { useExchangeContext } from "../../Context/ExchangeContext";
import { GlobalState } from "../../Context/GlobalContext";
import { useFetchAPISingle } from "../../Hooks/useFetchAPISingle";
import { CryptoName, GrayContainer } from "../../StyledComponents/StyledCrypto";
import { TCryptoDetail } from "../../Type/type";
import Links from "./Links";
import { Market } from "./Market";
import { TableExchange } from "./Table";

export const Detail = () => {
  const { exchange } = useExchangeContext();
  const { colorScheme } = useMantineColorScheme();
  const { currency, symbol } = GlobalState();
  const { data: btc } = useFetchAPISingle(
    SingleCoin("bitcoin")
  ) as unknown as TCryptoDetail;

  const volume =
    +btc?.market_data?.current_price[currency.toLowerCase()] *
    exchange.volume_btc;

  return (
    <Paper radius={0}>
      <Container size="xl" px="xs" pt="xl">
        <Grid>
          <Grid.Col xs={4}>
            <Paper style={{ paddingBottom: "1rem" }}>
              <GrayContainer>
                <Image src={exchange.image} radius="xl" height={30} />
                <CryptoName color={colorScheme}>{exchange.name}</CryptoName>
              </GrayContainer>
            </Paper>

            <Links />
            <Market />
          </Grid.Col>
          <Grid.Col xs={8}>
            <Text size="xl" weight="bold">
              Volume(24h)
            </Text>
            <CryptoName color={colorScheme}>
              {" "}
              {!exchange.volume24h
                ? `${symbol} ${numeral(volume).format("0,0.00")}`
                : `$ ${numeral(exchange.volume24h).format("0,0.00")}`}
            </CryptoName>
            <Text size="md" style={{ opacity: 0.7 }}>
              {" "}
              {numeral(exchange.volume_btc).format("0,0.00")} BTC
            </Text>

            <Text size="sm" style={{ marginBlockStart: "3rem" }}>
              {exchange.description}
            </Text>
          </Grid.Col>
        </Grid>
        <Container fluid pt={"5rem"}>
          <Divider />
          <CryptoName color={colorScheme} style={{ paddingBlock: "1rem" }}>
            {exchange.name} Markets
          </CryptoName>
          <Paper style={{ paddingBottom: "10rem" }}>
            <Divider />
            <TableExchange />
          </Paper>
        </Container>
      </Container>
    </Paper>
  );
};
