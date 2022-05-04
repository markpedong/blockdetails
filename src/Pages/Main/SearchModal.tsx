import { Container, Image, Input, Paper, Text } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchData } from "../../Type/Navbar";
import { TrendingCoins } from "../Coin/TrendingCoins";

export type SearchFunction = {
  data: SearchData;
  value: string;
  setSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchModal = ({
  setSearch,
  data,
  value,
  setValue,
}: SearchFunction) => {
  const coinResult = data?.coins?.filter((val) => {
    if (value === "") return val;

    return val.name.toLowerCase().includes(value.toLowerCase());
  });

  const exchangeResult = data?.exchanges?.filter((val) => {
    if (value === "") return val;

    return val.name.toLowerCase().includes(value.toLowerCase());
  });

  const navigate = useNavigate();

  return (
    <>
      <Paper>
        <Input
          variant="filled"
          placeholder="eg. Ethereum, Avalanche, Binance Smart Chain"
          size="sm"
          //set the type for event in onChange
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
        />

        <Container
          px={0}
          fluid
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBlockStart: "1rem",
          }}
        >
          <Paper>
            <Text weight="bolder" size="md">
              Coins:{" "}
            </Text>
            {coinResult
              ?.map((item) => (
                <Paper
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "1rem",
                    paddingBlock: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <Image src={item.large} height={15} width={15} />
                  <Text size="sm" weight="bold">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(`/cryptocurrency/${item.id}`);
                        setSearch(false);
                        setValue("");
                      }}
                    >
                      {item.name}
                    </span>{" "}
                    <span style={{ opacity: 0.7, fontSize: "0.8rem" }}>
                      {item.symbol}
                    </span>
                  </Text>
                </Paper>
              ))
              .slice(0, 10)}
          </Paper>
          <Paper>
            <Text weight="bolder" size="md">
              Exchanges:{" "}
            </Text>
            {exchangeResult
              ?.map((item) => (
                <Paper
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "1rem",
                    paddingBlock: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <Image src={item.large} height={15} width={15} />
                  <Text size="sm" weight="bold">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(`/exchanges/${item.id}`);
                        setSearch(false);
                      }}
                    >
                      {item.name}
                    </span>{" "}
                    <span
                      style={{
                        opacity: 0.7,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.market_type}
                    </span>
                  </Text>
                </Paper>
              ))
              .slice(0, 10)}
          </Paper>
        </Container>
      </Paper>
      <TrendingCoins setSearch={setSearch} />
    </>
  );
};
