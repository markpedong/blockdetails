import { Container, Table, Text } from "@mantine/core";
import numeral from "numeral";
import React, { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { PaginationComp } from "../../Components/Pagination";
import { TableComponent } from "../../Components/TableBody";
import { TableHeader } from "../../Components/TableHeader";
import { numberWithCommas } from "../../Config/Function";
import { GlobalState } from "../../Context/GlobalContext";
import { useProjectContext } from "../../Context/ProjectContext";
import { ProfitChange } from "../../StyledComponents/StyledCarousel";

export const ProjectTable = () => {
  const { blockchain, data } = useProjectContext();
  const [page, setPage] = useState(1);
  const [res_page, setResPage] = useState(100);
  const { symbol } = GlobalState();

  let navigate = useNavigate();
  const navigateCoin = (id: string) => {
    navigate(`/cryptocurrency/${id}`);
  };

  const end = page * res_page;
  const first = end - res_page + 1;
  const last = end - res_page + 100;

  return (
    <Container py="4rem" size="xl" px="xs">
      <Text size="xl" mb="md" align="center" weight="bolder">
        {blockchain?.name}
      </Text>
      <Text mb="2rem">{blockchain?.content}</Text>
      {data?.length > 0 && (
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
                query={true}
                firstHeader="#"
                secondHeader="Name"
                thirdHeader="Price"
                fourthToFifthHeader={["Price 24%", "Market Cap 24h%"]}
                sixthToNinthHeader={[
                  "Market Cap",
                  "Volume (24h)",
                  "Circulating Supply",
                  "Max Supply",
                ]}
              />
            </thead>
            <tbody>
              {data
                ?.map((coin, index) => {
                  const profit = coin.price_change_percentage_24h >= 0.0;
                  const mcap = coin.market_cap_change_percentage_24h >= 0.0;

                  return (
                    <TableComponent
                      query={true}
                      alt={coin.name}
                      image={coin.image}
                      name={coin.name}
                      key={coin.name}
                      name_symbol={coin.symbol}
                      rank={index + 1}
                      id={coin.id}
                      navigateCrypto={() => navigateCoin(coin.id)}
                      thirdData={
                        coin.current_price === null
                          ? "--"
                          : `${symbol} ${coin.current_price}`
                      }
                      fourthData={
                        coin.price_change_percentage_24h ? (
                          <ProfitChange profit={profit}>
                            {profit ? (
                              <TiArrowSortedUp />
                            ) : (
                              <TiArrowSortedDown />
                            )}{" "}
                            {coin.price_change_percentage_24h
                              ?.toFixed(2)
                              .replace("-", "")}
                            %
                          </ProfitChange>
                        ) : (
                          "--"
                        )
                      }
                      fifthData={
                        coin.market_cap_change_percentage_24h ? (
                          <ProfitChange profit={mcap}>
                            {mcap ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
                            {coin.market_cap_change_percentage_24h
                              ?.toFixed(2)
                              .replace("-", "")}
                            %
                          </ProfitChange>
                        ) : (
                          "--"
                        )
                      }
                      sixthData={
                        coin.market_cap
                          ? `${symbol} ${numeral(coin.market_cap).format(
                              "0,0.00"
                            )}`
                          : "--"
                      }
                      seventhData={
                        coin.total_volume
                          ? `${symbol} ${numeral(coin.total_volume).format(
                              "0,0.00"
                            )}`
                          : "--"
                      }
                      eighthData={
                        coin.circulating_supply
                          ? numberWithCommas(coin.circulating_supply)
                          : "--"
                      }
                      ninthData={
                        coin.max_supply === null
                          ? "∞"
                          : numeral(coin.max_supply).format("0,0.00")
                      }
                    />
                  );
                })
                .slice(end - res_page, end)}
            </tbody>
          </Table>
          <PaginationComp
            first={first}
            last={last}
            active={data?.length}
            total={Math.ceil(data?.length / res_page)}
            page={page}
            res_page={res_page}
            setPage={setPage}
            setResPage={setResPage}
          />
        </>
      )}
    </Container>
  );
};
