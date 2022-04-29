import { Container, Image, Text, useMantineColorScheme } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    axios.get(TRENDING_LINK).then(({ data }) => setTrending(data));
  };

  let navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <StyledContainer fluid color={colorScheme} style={{ marginTop: "2rem" }}>
      <Text size="lg" weight="bolder" style={{ paddingBottom: "1rem" }}>
        Trending Coins and Tokens 🔥
      </Text>
      <Container fluid px={0}>
        {trending?.coins
          ?.map((coin) => (
            <GrayContainer style={{ paddingTop: "1rem" }} key={coin.item.id}>
              <Image src={coin.item.large} height={20} />
              <Text
                weight="bold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/cryptocurrency/${coin.item.id}`)}
              >
                {coin.item.name}
              </Text>
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
