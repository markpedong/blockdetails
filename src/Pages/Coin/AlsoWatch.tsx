import {
  Container,
  Image,
  Paper,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import numeral from "numeral";
import AliceCarousel from "react-alice-carousel";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { responsive2 } from "../../Config/Transition";
import { useCoinContext } from "../../Context/CoinContext";
import { GlobalState } from "../../Context/GlobalContext";
import { TrendingState } from "../../Context/TrendingCoinContext";
import { PriceChange } from "../../StyledComponents/StyledCrypto";

export const PeopleAlsoWatch = () => {
  const { trending } = TrendingState();
  const { symbol } = GlobalState();
  const { crypto } = useCoinContext();
  const filteredTrending = trending.filter((coin) => coin.id !== crypto.id);
  const { colorScheme } = useMantineColorScheme();

  let navigate = useNavigate();

  const items = filteredTrending?.map((coin) => {
    const profit = coin.price_change_percentage_24h >= 0.0;
    const colorProfit = profit ? "#16c784" : "#ea3943";

    return (
      <Paper
        key={coin.name}
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          alignItems: "center",
          backgroundColor: colorScheme === "dark" ? "#222531" : "#fff",
          padding: "1rem",
          marginInline: "1rem",
          marginBlock: "1rem",
          marginBlockEnd: "10rem",
          borderRadius: "var(--radius-3)",
          boxShadow: "var(--shadow-3)",
        }}
      >
        <Image src={coin.image} alt={coin.name} width={50} radius={360} />
        <Container
          onClick={() => navigate(`/cryptocurrency/${coin.id}`)}
          fluid
          px={0}
          style={{
            color: colorScheme === "dark" ? "white" : "black",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            cursor: "pointer",
          }}
        >
          <Text weight="bold" transform="uppercase">
            {coin.symbol}
          </Text>
          <Text weight="bolder">{coin.name}</Text>
          <Text weight="bolder">
            {symbol}{" "}
            {coin.current_price < 1
              ? coin.current_price?.toFixed(4)
              : numeral(coin.current_price).format("0,0")}
          </Text>
        </Container>
        <Container
          pt="md"
          style={{
            gridColumn: "1/3",
          }}
        >
          <PriceChange profit={colorProfit} size="sm" align="center">
            {profit ? (
              <AiFillCaretUp size={15} />
            ) : (
              <AiFillCaretDown size={15} />
            )}{" "}
            {coin.price_change_percentage_24h?.toFixed(2).replace("-", "")} %
          </PriceChange>
        </Container>
      </Paper>
    );
  });

  return (
    <Container fluid px={0} mt="xl">
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive2}
        autoPlay
        items={items}
      />
    </Container>
  );
};
