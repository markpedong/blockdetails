import { Container, Image, Text, useMantineColorScheme } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TRENDING_LINK } from "../../Config/Links";
import {
  GrayContainer,
  GrayText,
  StyledContainer,
} from "../../StyledComponents/StyledCrypto";

type Props = {
  coins: {
    item: {
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: string;
      large: string;
    };
  }[];
};

export const TrendingCoins = () => {
  const { colorScheme } = useMantineColorScheme();
  const { id } = useParams();
  const [trending, setTrending] = useState([] as unknown as Props);

  const fetchData = async () => {
    const coin = axios.get(TRENDING_LINK).then(({ data }) => setTrending(data));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  console.log(trending);

  return (
    <StyledContainer fluid color={colorScheme} style={{ marginTop: "2rem" }}>
      <Text size="lg" weight="bolder" style={{ paddingBottom: "1rem" }}>
        Trending Coins and Tokens 🔥
      </Text>
      <Container fluid px={0}>
        {trending?.coins
          ?.map((coin) => (
            <GrayContainer style={{ paddingTop: "1rem" }}>
              <Image src={coin.item.large} height={20} />
              <Text weight="bold">{coin.item.name}</Text>
              <Text
                style={{ opacity: 0.5, flexGrow: 1 }}
                size="sm"
                weight="bold"
              >
                {coin.item.symbol}
              </Text>
              <GrayText color={colorScheme}>
                # {coin.item.market_cap_rank}
              </GrayText>
            </GrayContainer>
          ))
          .slice(0, 5)}
      </Container>
    </StyledContainer>
  );
};

export default TrendingCoins;
