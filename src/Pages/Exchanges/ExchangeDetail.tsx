import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Grid,
  Image,
  Paper,
  Table,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import numeral from "numeral";
import {
  AiFillFacebook,
  AiFillFlag,
  AiFillRead,
  AiFillRedditCircle,
  AiFillTag,
  AiFillTwitterCircle,
  AiOutlineLink,
} from "react-icons/ai";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { TableComponent } from "../../Components/TableBody";
import { TableHeader } from "../../Components/TableHeader";
import { useExchangeContext } from "../../Context/ExchangeContext";
import { GlobalState } from "../../Context/GlobalContext";
import { TableState } from "../../Context/TableContext";
import { ProfitChange } from "../../StyledComponents/StyledCarousel";
import { CryptoName, GrayContainer } from "../../StyledComponents/StyledCrypto";

export const ExchangeDetail = () => {
  const { exchange } = useExchangeContext();
  const { colorScheme } = useMantineColorScheme();
  const { coins } = TableState();
  const { symbol } = GlobalState();
  let navigate = useNavigate();

  const navigateCoin = (id: string) => {
    navigate(`/cryptocurrency/${id}`);
  };

  const links = [
    {
      icon: <BsFillCalendarDateFill fontSize={23} />,
      name: exchange.year,
    },
    {
      icon: <AiFillFlag fontSize={23} />,
      name: exchange.country,
    },
    {
      icon: <AiOutlineLink fontSize={23} />,
      name: exchange.url,
      href: exchange.url,
    },
    {
      icon: <AiFillRedditCircle fontSize={23} />,
      name: "Reddit",
      href: exchange.reddit,
    },
    {
      icon: <AiFillTwitterCircle fontSize={23} />,
      name: "Twitter",
      href: exchange.links.twitter?.[0],
    },
    {
      icon: <AiFillFacebook fontSize={23} />,
      name: "Facebook",
      href: exchange.fb_url,
    },
    {
      icon: <AiFillTag fontSize={23} />,
      name: "Exchange",
    },
  ];

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

  //remove duplicates in exchanges.tickers
  const tickers = exchange.tickers?.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.coin_id === item.coin_id)
  );

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

            {links?.map((link, index) => (
              <GrayContainer key={index} style={{ paddingTop: "0.5rem" }}>
                {!link.href ? (
                  ""
                ) : (
                  <>
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
                  </>
                )}
              </GrayContainer>
            ))}

            <Grid>
              <Grid.Col
                xs={12}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
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
              </Grid.Col>
              <Grid.Col
                xs={12}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
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
              </Grid.Col>
              <Grid.Col
                xs={12}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
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
              </Grid.Col>
              <Grid.Col
                xs={12}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
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
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col xs={8}>
            <Text size="xl" weight="bold">
              Volume(24h)
            </Text>
            <CryptoName color={colorScheme}>
              $ {numeral(exchange.volume24h).format("0,0.00")}
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
            <Table
              fontSize="xs"
              striped
              highlightOnHover
              verticalSpacing="xl"
              style={{
                maxWidth: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <thead>
                <TableHeader
                  query={true}
                  firstHeader="#"
                  secondHeader="Exchange"
                  thirdHeader="Pair"
                  fourthToFifthHeader={["Price 24%", "Market Cap 24h%"]}
                  sixthToNinthHeader={[
                    "Price",
                    "Volume (24h)",
                    "Market Cap (24h)",
                    "Trust Score",
                  ]}
                />
              </thead>
              <tbody>
                {tickers?.map((ticker, index) => {
                  const coin = coins.find((coin) => coin.id === ticker.coin_id);

                  const profit = coin?.price_change_percentage_24h! >= 0.0;
                  const mcap = coin?.market_cap_change_percentage_24h! >= 0.0;

                  return (
                    <TableComponent
                      query={true}
                      alt={ticker.base}
                      image={coin?.image!}
                      name={coin?.name!}
                      key={coin?.id}
                      navigateCrypto={() => navigateCoin(coin?.id!)}
                      rank={index + 1}
                      id={coin?.id!}
                      thirdData={
                        <a
                          href={ticker.trade_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {ticker.base} / {ticker.target}
                        </a>
                      }
                      fourthData={
                        !coin?.price_change_percentage_24h ? (
                          "--"
                        ) : (
                          <ProfitChange profit={profit}>
                            {profit ? (
                              <TiArrowSortedUp />
                            ) : (
                              <TiArrowSortedDown />
                            )}{" "}
                            {coin?.price_change_percentage_24h
                              ?.toFixed(2)
                              .replace("-", "")}
                            %
                          </ProfitChange>
                        )
                      }
                      fifthData={
                        !coin?.market_cap_change_percentage_24h ? (
                          "--"
                        ) : (
                          <ProfitChange profit={mcap}>
                            {mcap ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
                            {coin?.market_cap_change_percentage_24h
                              ?.toFixed(2)
                              .replace("-", "")}
                            %
                          </ProfitChange>
                        )
                      }
                      sixthData={
                        !coin?.current_price
                          ? "--"
                          : `${symbol} ${numeral(coin?.current_price).format(
                              "0,0.00"
                            )}`
                      }
                      seventhData={
                        !coin?.total_volume
                          ? "--"
                          : `${symbol} ${numeral(coin?.total_volume).format(
                              "0,0.00"
                            )}`
                      }
                      eighthData={
                        !coin?.market_cap
                          ? "--"
                          : `${symbol} ${numeral(coin?.market_cap).format(
                              "0,0.00"
                            )}`
                      }
                      ninthData={
                        <Button
                          style={{
                            backgroundColor: `${ticker.trust_score}`,
                            blockSize: "15px",
                            inlineSize: "5px",
                            justifyContent: "center",
                            borderRadius: "var(--radius-round)",
                          }}
                        />
                      }
                    />
                  );
                })}
              </tbody>
            </Table>
          </Paper>
        </Container>
      </Container>
    </Paper>
  );
};
