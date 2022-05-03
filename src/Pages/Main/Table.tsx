import { Table } from "@mantine/core";
import numeral from "numeral";
import React from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "../../Components/Loader";
import { PaginationComp } from "../../Components/Pagination";
import { TableComponent } from "../../Components/TableBody";
import { TableHeader } from "../../Components/TableHeader";
import { numberWithCommas } from "../../Config/Function";
import { GlobalState } from "../../Context/GlobalContext";
import { TableState } from "../../Context/TableContext";
import { ProfitChange } from "../../StyledComponents/StyledCarousel";
import { ErrorPage } from "../Other/Error";

export const CryptoTable = () => {
  const { coins, loading, page, setPage, setResPage, res_page, error } =
    TableState();
  const { symbol, global } = GlobalState();

  let navigate = useNavigate();

  const navigateCoin = (id: string) => {
    navigate(`/cryptocurrency/${id}`);
  };

  const first = Object.values(coins)[0];
  const last = Object.values(coins)[99];

  return (
    <div>
      {loading ? (
        <>
          <LoaderComp />
        </>
      ) : error ? (
        <>
          <ErrorPage />
        </>
      ) : (
        coins && (
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
                {coins?.map((coin) => {
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
                      rank={coin.market_cap_rank?.toString()}
                      id={coin.id}
                      navigateCrypto={() => navigateCoin(coin.id)}
                      symbol={symbol}
                      thirdData={numeral(coin.current_price).format("0,0.00")}
                      fourthData={
                        <ProfitChange profit={profit}>
                          {profit ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
                          {coin.price_change_percentage_24h
                            ?.toFixed(2)
                            .replace("-", "")}
                          %
                        </ProfitChange>
                      }
                      fifthData={
                        <ProfitChange profit={mcap}>
                          {mcap ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
                          {coin.market_cap_change_percentage_24h
                            ?.toFixed(2)
                            .replace("-", "")}
                          %
                        </ProfitChange>
                      }
                      sixthData={numeral(coin.market_cap).format("0,0.00")}
                      seventhData={numeral(coin.total_volume).format("0,0.00")}
                      eighthData={numberWithCommas(coin.circulating_supply)}
                      ninthData={
                        coin.max_supply === null
                          ? "∞"
                          : numeral(coin.max_supply).format("0,0.00")
                      }
                    />
                  );
                })}
              </tbody>
            </Table>
            <PaginationComp
              total={134}
              first={first?.market_cap_rank}
              last={last?.market_cap_rank}
              loading={loading}
              page={page}
              setPage={setPage}
              setResPage={setResPage}
              res_page={res_page}
              active={global?.active}
            />
          </>
        )
      )}
    </div>
  );
};
