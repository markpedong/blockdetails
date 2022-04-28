import { Image, MediaQuery, Table, Text, useMantineTheme } from "@mantine/core";
import numeral from "numeral";
import React from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "../../Components/Loader";
import { numberWithCommas } from "../../Config/Function";
import { GlobalState } from "../../Context/GlobalContext";
import { TableState } from "../../Context/TableContext";
import { ProfitChange } from "../../StyledComponents/StyledCarousel";
import { TableStyles } from "../../Theme/CreateStyles/Table";

export const CryptoTable = () => {
  const { coins, loading } = TableState();
  const { symbol } = GlobalState();
  const { colorScheme } = useMantineTheme();
  const { classes } = TableStyles();

  let navigate = useNavigate();

  const navigateCoin = (id: string) => {
    navigate(`/cryptocurrency/${id}`);
  };

  const darkmode = colorScheme === "dark" ? "white" : "black";

  return (
    <div>
      {loading ? (
        <>
          <LoaderComp />
        </>
      ) : (
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
              {/* prettier-ignore */}
              <tr>
              <th style={{ textAlign: "right", color: darkmode }}>#</th>
              <th style={{ textAlign: "left", color: darkmode }}>Name</th>
              <th style={{ textAlign: "right", color: darkmode }}>Price</th>
              <MediaQuery
                query="(max-width: 1200px)"
                styles={{ display: "none" }}
              >
                <th style={{ textAlign: "right", color: darkmode }}>Price 24%</th>
              </MediaQuery>
              <th style={{ textAlign: "right", color: darkmode }}>Market Cap</th>
              <MediaQuery
                query="(max-width: 1200px)"
                styles={{ display: "none" }}
              >
                <th style={{ textAlign: "right", color: darkmode }}>Market Cap 24h%</th>
              </MediaQuery>
              <th style={{ textAlign: "right", color: darkmode }}>Volume (24h)</th>
              <th style={{ textAlign: "right", color: darkmode }}>Circulating Supply</th>
              <th style={{ textAlign: "right", color: darkmode }}>Max Supply</th>
            </tr>
            </thead>
            <tbody>
              {coins?.map((coin) => {
                const profit = coin.price_change_percentage_24h >= 0.0;
                const mcap = coin.market_cap_change_percentage_24h >= 0.0;
                return (
                  <tr key={coin.id}>
                    {/* Rank */}
                    <td className={classes.rank}>{coin.market_cap_rank}</td>
                    {/* Name and Image */}
                    <td className={classes.TableName}>
                      <Image
                        radius={"lg"}
                        src={coin.image}
                        alt={coin.name}
                        width={22}
                        height={22}
                      />
                      <Text
                        size="xs"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigateCoin(coin.id)}
                      >
                        {coin.name}
                      </Text>
                      <Text size="xs" color="dimmed" transform="uppercase">
                        {coin.symbol}
                      </Text>
                    </td>
                    {/* Current Price */}
                    <td>
                      <Text size="xs" className={classes.TableBlack}>
                        {symbol} {numberWithCommas(coin.current_price)}
                      </Text>
                    </td>
                    {/* Price Percentage */}
                    <MediaQuery
                      query="(max-width: 1200px)"
                      styles={{ display: "none" }}
                    >
                      <td className={classes.TablePercentage}>
                        {
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
                        }
                      </td>
                    </MediaQuery>

                    {/* Market Cap */}
                    <td>
                      <Text size="xs" className={classes.TableBlack}>
                        {symbol} {numberWithCommas(coin.market_cap)}
                      </Text>
                    </td>
                    {/* Market Cap Percentage */}
                    <MediaQuery
                      query="(max-width: 1200px)"
                      styles={{ display: "none" }}
                    >
                      <td className={classes.TablePercentage}>
                        {
                          <ProfitChange profit={mcap}>
                            {mcap ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
                            {coin.market_cap_change_percentage_24h
                              ?.toFixed(2)
                              .replace("-", "")}
                            %
                          </ProfitChange>
                        }
                      </td>
                    </MediaQuery>

                    {/* Volume */}
                    <td>
                      <Text size="xs" className={classes.TableBlack}>
                        {symbol} {numberWithCommas(coin.total_volume)}
                      </Text>
                    </td>
                    {/* Circulating Supply */}
                    <td>
                      <Text size="xs" className={classes.TableBlack}>
                        {numeral(coin.circulating_supply).format("0,0")}
                      </Text>
                    </td>
                    {/* Max Supply*/}
                    <td>
                      <Text
                        size="xs"
                        transform="uppercase"
                        className={classes.TableBlack}
                      >
                        {coin.total_supply === null
                          ? "∞"
                          : numeral(coin.total_supply).format("0,0a")}
                      </Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};
