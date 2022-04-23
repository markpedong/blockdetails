import { Container, Image } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
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
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

export const Carousel = () => {
  const [trending, setTrending] = useState([] as TTrending[]);
  const { currency, symbol } = GlobalState();

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

  console.log(trending);

  const { classes } = CarouselStyles();
  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0.0;

    return (
      <Container className={classes.carousel} key={coin.id}>
        <Image
          src={coin.image}
          alt={coin.name}
          width={50}
          withPlaceholder
          radius={360}
        />
        <Container className={classes.description}>
          {symbol} {numberWithCommas(coin.current_price)}
          <ProfitChange profit={profit}>
            {profit ? <TiArrowSortedUp /> : <TiArrowSortedDown />}{" "}
            {coin.price_change_percentage_24h?.toFixed(2)?.replace("-", "")} %
          </ProfitChange>
          <CarouselPaper>{coin.name}</CarouselPaper>
        </Container>
      </Container>
    );
  });

  return (
    <AliceCarousel
      mouseTracking
      infinite
      autoPlayInterval={1000}
      animationDuration={1500}
      disableDotsControls
      disableButtonsControls
      responsive={responsive}
      // autoPlay
      items={items}
    />
  );
};
