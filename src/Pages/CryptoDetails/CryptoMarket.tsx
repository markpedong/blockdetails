import {
  Button,
  Image,
  MediaQuery,
  Table,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import numeral from "numeral";
import React from "react";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "../../Components/Loader";
import { MarketList } from "../../Config/API";
import { useCoinContext } from "../../Context/CoinContext";
import { GlobalState } from "../../Context/GlobalContext";
import { useFetchAPISingle } from "../../Hooks/useFetchAPISingle";
import { TableStyles } from "../../Theme/CreateStyles/Table";
import { TErrorLoading } from "../../Type/type";

export type TMarketType = TErrorLoading & {
  data: {
    name: string;
    tickers: {
      base: string;
      bid_ask_spread_percentage: number;
      coin_id: string;
      converted_last: {
        usd: number;
      };
      converted_volume: {
        usd: number;
      };
      cost_to_move_down_usd: number;
      cost_to_move_up_usd: number;
      market: {
        identifier: string;
        logo: string;
        name: string;
      };
      target: string;
      target_coin_id: string;
      trade_url: string;
      trust_score: string;
    }[];
  };
};

export const CryptoMarket = () => {
  const { crypto } = useCoinContext();
  const { data, loading, error } = useFetchAPISingle(
    MarketList(crypto.id, 1)
  ) as unknown as TMarketType;
  const { colorScheme } = useMantineColorScheme();
  const darkColor = colorScheme === "dark" ? "white" : "black";
  const { classes } = TableStyles();

  const sortedTickers = data?.tickers?.sort(
    (a, b) => b.converted_volume.usd - a.converted_volume.usd
  );
  let navigate = useNavigate();

  const navigateCoin = (id: string) => {
    navigate(`/exchanges/${id}`);
  };

  return loading ? (
    <>
      <LoaderComp />
    </>
  ) : (
    <>
      <Table
        fontSize="xs"
        striped
        highlightOnHover
        verticalSpacing="md"
        style={{
          maxWidth: "100%",
          whiteSpace: "nowrap",
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "right", color: darkColor }}>#</th>
            <th style={{ textAlign: "left", color: darkColor }}>Exchange</th>
            <th style={{ textAlign: "right", color: darkColor }}>Pair</th>
            <th style={{ textAlign: "right", color: darkColor }}>Price</th>
            <th style={{ textAlign: "right", color: darkColor }}>Spread</th>
            <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
              <th style={{ textAlign: "right", color: darkColor }}>
                +2% Depth
              </th>
            </MediaQuery>
            <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
              <th style={{ textAlign: "right", color: darkColor }}>
                -2% Depth
              </th>
            </MediaQuery>
            <th style={{ textAlign: "right", color: darkColor }}>24h Volume</th>
            <th style={{ textAlign: "right", color: darkColor }}>
              Trust Score
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTickers
            ?.map((ticker, index) => {
              const exchange = {
                base: ticker.base,
                down: numeral(ticker.cost_to_move_down_usd).format("$0,0.00"),
                id: ticker.market.identifier,
                image: ticker.market.logo,
                name: ticker.market.name,
                price: numeral(ticker.converted_last.usd).format("$0,0.00"),
                spread: ticker.bid_ask_spread_percentage?.toFixed(2),
                score: ticker.trust_score,
                target: ticker.target,
                up: numeral(ticker.cost_to_move_up_usd).format("$0,0.00"),
                url: ticker.trade_url,
                volume: numeral(ticker.converted_volume.usd).format("$0,0.00"),
              };
              return (
                <tr key={index}>
                  <td className={classes.rank}>{index + 1}</td>
                  <td className={classes.TableName}>
                    <Image
                      radius={"lg"}
                      src={exchange.image}
                      alt={exchange.name}
                      width={22}
                      height={22}
                    />
                    <Text
                      size="xs"
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigateCoin(exchange.id)}
                    >
                      {exchange.name}
                    </Text>
                  </td>
                  <td className={classes.TableBlack}>
                    <a href={exchange.url} target="_blank">
                      {exchange.base}/{exchange.target}
                    </a>
                  </td>
                  <td className={classes.TableBlack}>{exchange.price}</td>
                  <td className={classes.TableBlack}>{exchange.spread}%</td>
                  <td className={classes.TableBlack}>{exchange.up}</td>
                  <td className={classes.TableBlack}>{exchange.down}</td>
                  <td className={classes.TableBlack}>{exchange.volume}</td>
                  <td className={classes.TableBlack}>
                    <Button
                      radius="xl"
                      size="xs"
                      compact
                      style={{
                        backgroundColor: `${exchange.score}`,
                        height: "10px",
                        width: "20px",
                      }}
                    />
                  </td>
                </tr>
              );
            })
            .slice(0, 6)}
        </tbody>
      </Table>
    </>
  );
};
