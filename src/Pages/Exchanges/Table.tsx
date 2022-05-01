import { Table, UnstyledButton } from "@mantine/core";
import React from "react";
import { TableHeader } from "../../Components/TableHeader";
import { useExchangeContext } from "../../Context/ExchangeContext";
import { TableState } from "../../Context/TableContext";
import numeral from "numeral";
import { TableComponent } from "../../Components/TableBody";
import { useNavigate } from "react-router-dom";
import { ProfitChange } from "../../StyledComponents/StyledCarousel";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { GlobalState } from "../../Context/GlobalContext";

export const TableExchange = () => {
  const { exchange } = useExchangeContext();
  const { coins } = TableState();
  const { symbol } = GlobalState();

  //remove duplicates in exchanges.tickers
  const tickers = exchange.tickers?.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.coin_id === item.coin_id)
  );

  let navigate = useNavigate();

  const navigateCoin = (id: string) => {
    navigate(`/cryptocurrency/${id}`);
  };

  return (
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

          const matched = {
            price: numeral(coin?.current_price).format("0,0.00"),
            volume: numeral(coin?.total_volume).format("0,0.00"),
            mcap: numeral(coin?.market_cap).format("0,0.00"),
            mcap_per: coin?.market_cap_change_percentage_24h
              ?.toFixed(2)
              .replace("-", ""),
            price_per: coin?.price_change_percentage_24h
              ?.toFixed(2)
              .replace("-", ""),

            profit: coin?.price_change_percentage_24h! >= 0.0,
            mcap_profit: coin?.market_cap_change_percentage_24h! >= 0.0,
          };

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
                <a href={ticker.trade_url} target="_blank" rel="noreferrer">
                  {ticker.base} / {ticker.target}
                </a>
              }
              fourthData={
                !coin?.price_change_percentage_24h ? (
                  "--"
                ) : (
                  <ProfitChange profit={matched.profit}>
                    {matched.profit ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )}{" "}
                    {matched.price_per}%
                  </ProfitChange>
                )
              }
              fifthData={
                !coin?.market_cap_change_percentage_24h ? (
                  "--"
                ) : (
                  <ProfitChange profit={matched.price_per}>
                    {matched.price_per ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )}{" "}
                    {matched.mcap_per}%
                  </ProfitChange>
                )
              }
              sixthData={
                !coin?.current_price ? "--" : `${symbol} ${matched.price}`
              }
              seventhData={
                !coin?.total_volume ? "--" : `${symbol} ${matched.volume}`
              }
              eighthData={
                !coin?.market_cap ? "--" : `${symbol} ${matched.mcap}`
              }
              ninthData={
                <UnstyledButton
                  style={{
                    backgroundColor: `${ticker.trust_score}`,
                    blockSize: "15px",
                    inlineSize: "15px",
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
  );
};
