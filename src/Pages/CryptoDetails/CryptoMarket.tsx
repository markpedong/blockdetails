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
import { TableComponent } from "../../Components/TableBodyComp";
import { TableHeader } from "../../Components/TableHeader";
import { MarketList } from "../../Config/API";
import { useCoinContext } from "../../Context/CoinContext";
import { GlobalState } from "../../Context/GlobalContext";
import { useFetchAPISingle } from "../../Hooks/useFetchAPISingle";
import { TableStyles } from "../../Theme/CreateStyles/Table";
import { TErrorLoading, TMarketType } from "../../Type/type";

export const CryptoMarket = () => {
  const { crypto } = useCoinContext();
  const { data, loading } = useFetchAPISingle(
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
          marginBlockEnd: "3rem",
        }}
      >
        <thead>
          <TableHeader
            firstHeader="#"
            secondHeader="Exchange"
            thirdHeader="Pair"
            fourthToFifthHeader={["+2% Depth", "-2% Depth"]}
            sixthToNinthHeader={[
              "Price",
              "24h Volume",
              "Spread",
              "Trust Score",
            ]}
          />
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
                <TableComponent
                  key={exchange.name}
                  alt={ticker.market.identifier}
                  image={ticker.market.logo}
                  name={ticker.market.name}
                  rank={index + 1}
                  id={exchange.id}
                  navigateCrypto={() => navigateCoin(exchange.id)}
                  thirdData={
                    <a href={exchange.url} target="_blank">
                      {exchange.base}/{exchange.target}
                    </a>
                  }
                  fourthData={exchange.up}
                  fifthData={exchange.down}
                  sixthData={exchange.price}
                  seventhData={exchange.volume}
                  eighthData={exchange.spread}
                  ninthData={
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
                  }
                />
              );
            })
            .slice(0, 6)}
        </tbody>
      </Table>
    </>
  );
};
