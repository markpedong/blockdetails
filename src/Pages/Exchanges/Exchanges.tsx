import { Container, Paper, Table } from "@mantine/core";
import numeral from "numeral";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "../../Components/Loader";
import { PaginationComp } from "../../Components/Pagination";
import { TableComponent } from "../../Components/TableBody";
import { TableHeader } from "../../Components/TableHeader";
import { ExchangesList, Exchange_PAPRIKA, SingleCoin } from "../../Config/API";
import { GlobalState } from "../../Context/GlobalContext";
import { useFetchAPISingle } from "../../Hooks/useFetchAPISingle";
import {
  Currency,
  StyledDiv,
  TRUST_SCORE,
} from "../../StyledComponents/StyledExchange";
import {
  matchData,
  Paprika_Exchange,
  TCryptoDetail,
  TExchangeType,
} from "../../Type/type";
import { ErrorPage } from "../Other/Error";
import { ExchangeHeader } from "./ExchangeHeader";

export const Exchanges = () => {
  const [page, setPage] = useState(1);
  const [resPage, setResPage] = useState(100);
  const { currency, symbol } = GlobalState();

  const { data: btc } = useFetchAPISingle(
    SingleCoin("bitcoin")
  ) as unknown as TCryptoDetail;

  const { data, error, loading } = useFetchAPISingle(
    ExchangesList(page, resPage)
  ) as unknown as TExchangeType;

  const { data: coin_paprika } = useFetchAPISingle(
    Exchange_PAPRIKA()
  ) as unknown as Paprika_Exchange;

  let navigate = useNavigate();

  const navigateCoin = (id: string) => {
    navigate(`/exchanges/${id}`);
  };

  const first = data?.[0];
  const last = data?.[99];

  const filteredExchanges = coin_paprika?.filter(
    (exchange) => exchange.active === true && exchange.website_status === true
  );

  return (
    <Paper radius={0}>
      <Container size="xl" px="xs" pt="xl">
        <ExchangeHeader />
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
                    maxHeight: "100%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <thead>
                    <TableHeader
                      firstHeader="#"
                      query={true}
                      secondHeader="Exchange"
                      thirdHeader="Volume (24h)"
                      fourthToFifthHeader={[
                        "Markets",
                        "Currencies",
                        "Year Established",
                        "Sessions/ Month",
                        "Trust Score",
                      ]}
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

                      const paprikaData = filteredExchanges?.find(
                        (paprika) =>
                          paprika.id === exchange.id ||
                          paprika.name === exchange.name
                      ) as matchData;

                      return (
                        <TableComponent
                          alt={exchange.name}
                          id={exchange.id}
                          image={exchange.image}
                          key={exchange.id}
                          name={exchange.name}
                          height="90px"
                          navigateCrypto={() => navigateCoin(exchange.id)}
                          query={true}
                          rank={exchange.trust_score_rank}
                          thirdData={`${symbol} ${converted_volume.volume}`}
                          fourthData={
                            !paprikaData?.markets ? "--" : paprikaData?.markets
                          }
                          fifthData={
                            paprikaData?.fiats.length > 0 ? (
                              <StyledDiv>
                                <Currency>
                                  {paprikaData?.fiats
                                    .map((fiat) => (
                                      <span key={fiat.name}>
                                        {fiat.symbol},{" "}
                                      </span>
                                    ))
                                    .slice(0, 3)}
                                </Currency>
                                {paprikaData?.fiats.length > 0 ? (
                                  <span>
                                    and +{paprikaData?.fiats.length} more
                                  </span>
                                ) : (
                                  ""
                                )}
                              </StyledDiv>
                            ) : (
                              "--"
                            )
                          }
                          sixthData={
                            !exchange.year_established
                              ? "--"
                              : exchange.year_established
                          }
                          seventhData={
                            !paprikaData?.sessions_per_month
                              ? "--"
                              : numeral(paprikaData?.sessions_per_month).format(
                                  "0,0"
                                )
                          }
                          eighthData={
                            !exchange.trust_score ? (
                              "--"
                            ) : (
                              <TRUST_SCORE>{exchange.trust_score}</TRUST_SCORE>
                            )
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
      </Container>
    </Paper>
  );
};
