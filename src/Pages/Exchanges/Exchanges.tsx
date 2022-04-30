import {
  Button,
  Collapse,
  Container,
  Grid,
  Paper,
  Table,
  Text,
} from "@mantine/core";
import numeral from "numeral";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "../../Components/Loader";
import { PaginationComp } from "../../Components/Pagination";
import { TableComponent } from "../../Components/TableBody";
import { TableHeader } from "../../Components/TableHeader";
import { ExchangesList, SingleCoin } from "../../Config/API";
import { GlobalState } from "../../Context/GlobalContext";
import { useFetchAPISingle } from "../../Hooks/useFetchAPISingle";
import { TCryptoDetail, TExchangeType } from "../../Type/type";
import { ErrorPage } from "../Other/Error";

export const Exchanges = () => {
  const [opened, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [resPage, setResPage] = useState(100);
  const { currency, symbol } = GlobalState();

  const { data: btc } = useFetchAPISingle(
    SingleCoin("bitcoin")
  ) as unknown as TCryptoDetail;

  const { data, error, loading } = useFetchAPISingle(
    ExchangesList(page, resPage)
  ) as unknown as TExchangeType;

  let navigate = useNavigate();

  const navigateCoin = (id: string) => {
    navigate(`/exchanges/${id}`);
  };

  const first = data?.[0];
  const last = data?.[99];

  return (
    <Container size="xl" px="xs" mt="xl">
      <Paper>
        <Grid>
          <Grid.Col xs={7}>
            <Text size="xl" weight="bolder" pb="lg">
              Top Cryptocurrency Spot Exchanges
            </Text>
            <Text size="sm" weight="normal" pb="lg">
              CoinMarketCap and Coingecko ranks and scores exchanges based on
              traffic, liquidity, trading volumes, and confidence in the
              legitimacy of trading volumes reported.{" "}
              <Button
                onClick={() => setOpen((o) => !o)}
                variant="light"
                compact
              >
                Read More
              </Button>
            </Text>
            <Collapse in={opened}>test</Collapse>
          </Grid.Col>
        </Grid>

        <div>
          {loading ? (
            <>
              <LoaderComp />
            </>
          ) : error ? (
            <ErrorPage />
          ) : (
            data && (
              <>
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
                      firstHeader="#"
                      query={false}
                      secondHeader="Exchange"
                      thirdHeader="Volume (24h)"
                      fourthToFifthHeader={["Year Established", "Trust Score"]}
                    />
                  </thead>
                  <tbody>
                    {data?.map((exchange) => {
                      const converted_volume = {
                        volume: numeral(
                          exchange.trade_volume_24h_btc *
                            +btc?.market_data.current_price[
                              currency.toLowerCase()
                            ]
                        ).format("0,0.00"),
                      };

                      return (
                        <TableComponent
                          alt={exchange.name}
                          image={exchange.image}
                          name={exchange.name}
                          key={exchange.name}
                          rank={exchange.trust_score_rank}
                          id={exchange.id}
                          navigateCrypto={() => navigateCoin(exchange.id)}
                          symbol={symbol}
                          thirdData={converted_volume.volume}
                          fourthData={
                            exchange.year_established === null
                              ? "--"
                              : exchange.year_established
                          }
                          fifthData={
                            exchange.trust_score === null
                              ? "--"
                              : exchange.trust_score
                          }
                        />
                      );
                    })}
                  </tbody>
                </Table>
              </>
            )
          )}
        </div>
        <PaginationComp
          first={first?.trust_score_rank}
          last={last?.trust_score_rank}
          loading={loading}
          setPage={setPage}
          setResPage={setResPage}
          page={page}
          res_page={resPage}
          total={5}
        />
      </Paper>
    </Container>
  );
};
