import {
  Container,
  Image,
  Loader,
  SimpleGrid,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { TrendingCoins } from "../../Config/API";
import { numberWithCommas } from "../../Config/Function";
import { responsive } from "../../Config/Transition";
import { GlobalState } from "../../Context/GlobalContext";
import {
  CarouselPaper,
  ProfitChange,
} from "../../Styled Components/StyledCarousel";
import { CarouselStyles } from "../../Theme/CreateStyles/Carousel";
import { TTrending } from "../../Type/type";

export const Carousel = () => {
  const [trending, setTrending] = useState([] as TTrending[]);
  const { currency, symbol } = GlobalState();
  const { colorScheme } = useMantineColorScheme();
  const { classes } = CarouselStyles();

  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));

    setTrending(data);
  };
  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);

  let navigate = useNavigate();

  const navigateCoin = (id: string) => {
    navigate(`/cryptocurrency/${id}`);
  };

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0.0;

    return (
      <Container className={classes.carousel}>
        <Text
          className={classes.link}
          key={coin.id}
          onClick={() => navigateCoin(coin.id)}
          px={10}
        >
          <Image
            src={coin.image}
            alt={coin.name}
            width={50}
            withPlaceholder
            radius={360}
          />
          <Container className={classes.description} px={10}>
            {symbol} {numberWithCommas(coin.current_price)}
            <ProfitChange profit={profit}>
              {profit ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
              {coin.price_change_percentage_24h?.toFixed(2)?.replace("-", "")} %
            </ProfitChange>
            <CarouselPaper>{coin.name}</CarouselPaper>
          </Container>
        </Text>
      </Container>
    );
  });

  return (
    <>
      {trending.length > 0 ? (
        <AliceCarousel
          mouseTracking
          infinite
          autoPlayInterval={1000}
          animationDuration={1500}
          disableDotsControls
          disableButtonsControls
          responsive={responsive}
          autoPlay
          items={items}
        />
      ) : (
        <div>
          <SimpleGrid cols={1} className={classes.loader}>
            <Loader
              variant="bars"
              size="lg"
              color={colorScheme === "dark" ? "blue" : "indigo"}
            />
          </SimpleGrid>
        </div>
      )}
    </>
  );
};
