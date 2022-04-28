import { Container, Image, Text } from "@mantine/core";
import React from "react";
import AliceCarousel from "react-alice-carousel";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "../../Components/Loader";
import { numberWithCommas } from "../../Config/Function";
import { responsive } from "../../Config/Transition";
import { GlobalState } from "../../Context/GlobalContext";
import { TrendingState } from "../../Context/TrendingCoinContext";
import {
  CarouselPaper,
  ProfitChange,
} from "../../StyledComponents/StyledCarousel";
import { CarouselStyles } from "../../Theme/CreateStyles/Carousel";

export const Carousel = () => {
  const { trending } = TrendingState();
  const { symbol, loading } = GlobalState();
  const { classes } = CarouselStyles();

  let navigate = useNavigate();

  const navigateCoin = (id: string) => {
    navigate(`/cryptocurrency/${id}`);
  };

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0.0;

    return (
      <Container className={classes.carousel} key={coin.name}>
        <Text
          className={classes.link}
          key={coin.id}
          onClick={() => navigateCoin(coin.id)}
          px={10}
        >
          <Image src={coin.image} alt={coin.name} width={50} radius={360} />
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
      {loading ? (
        <div>
          <LoaderComp />
        </div>
      ) : (
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
      )}
    </>
  );
};
