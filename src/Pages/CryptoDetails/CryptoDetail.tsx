import {
  Container,
  Grid,
  Image,
  Paper,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import numeral from "numeral";
import React from "react";
import { useParams } from "react-router-dom";
import { CaretRightIcon } from "@radix-ui/react-icons";
import { LoaderComp } from "../../Components/Loader";
import { SingleCoin } from "../../Config/API";
import { GlobalState } from "../../Context/GlobalContext";
import { useFetchAPISingle } from "../../Hooks/useFetchAPISingle";
import { TCryptoDetail } from "../../Type/type";
import {
  CryptoName,
  GrayText,
  GrayContainer,
  SelectLink,
} from "../../Styled Components/StyledCrypto";
import { RiArrowDropRightLine } from "react-icons/ri";

export const CryptoDetail = () => {
  const { id } = useParams();
  const { data, error, loading } = useFetchAPISingle(
    SingleCoin(id as string)
  ) as unknown as TCryptoDetail;
  const { currency, symbol } = GlobalState();
  const { colorScheme } = useMantineColorScheme();

  // prettier-ignore
  const crypto = {
    algo: data?.hashing_algorithm,
    ath_date: data?.market_data.ath_date[currency.toLowerCase()],
    ath_per: data?.market_data.ath_change_percentage[currency.toLowerCase()],
    ath: numeral(data?.market_data.ath[currency.toLowerCase()]).format("0,0"),
    atl_date: data?.market_data.atl_date[currency.toLowerCase()],
    atl_per: data?.market_data.atl_change_percentage[currency.toLowerCase()],
    atl: numeral(data?.market_data.atl[currency.toLowerCase()]).format("0,0"),
    categories: data?.categories,
    categories1: 'Cryptocurrency',
    categories2: 'Coins',
    circ_supply: numeral(data?.market_data.circulating_supply).format("0,0"),
    date_origin: data?.genesis_date,
    description: data?.description.en,
    forum_site: data?.links?.official_forum_url?.filter((link) => link !== ""),
    high_24: numeral(data?.market_data.high_24h[currency.toLowerCase()]).format("0,0"),
    home_site: data?.links?.homepage?.filter((link) => link !== ""),
    id: data?.id,
    img_large: data?.image?.large,
    img_small: data?.image?.small,
    img_thumb: data?.image?.thumb,
    liq_score: data?.liquidity_score,
    low_24: numeral(data?.market_data.low_24h[currency.toLowerCase()]).format("0,0"),
    max_supply: numeral(data?.market_data.max_supply).format("0,0"),
    mcap_per: data?.market_data.market_cap_change_percentage_24h_in_currency[currency.toLowerCase()],
    mcap_rank: data?.market_cap_rank,
    mcap: numeral(data?.market_data.market_cap[currency.toLowerCase()]).format("0,0"),
    name: data?.name,
    price_change: data?.market_data.price_change_percentage_24h_in_currency[currency.toLowerCase()],
    price: numeral(data?.market_data.current_price[currency.toLowerCase()]).format("0,0"),
    rank: data?.coingecko_rank,
    reddit: data?.links.subreddit_url,
    scan_site: data?.links?.blockchain_site?.filter((link) => link !== ""),
    source_code: data?.links?.repos_url?.github.filter((link) => link !== ""),
    symbol: data?.symbol,
    total_supply: numeral(data?.market_data.total_supply).format("0,0"),
    valuation: numeral(data?.market_data.fully_diluted_valuation).format("0,0"),
    volume: numeral(data?.market_data.total_volume).format("0,0"),
  };

  return loading ? (
    <Paper sx={{ borderRadius: 0 }}>
      <Container
        sx={{
          blockSize: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoaderComp />
      </Container>
    </Paper>
  ) : (
    <Paper sx={{ borderRadius: 0 }}>
      <Container size="xl" px="xs" pt="xl">
        {/* Categories Header */}
        <Paper sx={{ display: "flex" }}>
          <Text size="xs" weight="bold">
            {crypto.categories1}
          </Text>{" "}
          <RiArrowDropRightLine />
          <Text size="xs" weight="bold">
            {crypto.categories2}
          </Text>{" "}
          <RiArrowDropRightLine />
          <Text size="xs" weight="bold">
            {crypto.name}
          </Text>{" "}
        </Paper>
        {/* Name and Price Container */}
        <Grid columns={24} pt="xl">
          {/* Name */}
          <Grid.Col lg={9} pt="xl">
            {/* name, image, symbol */}
            <GrayContainer pb={20}>
              <Image src={crypto.img_large} height={32} />
              <CryptoName color={colorScheme}> {crypto.name} </CryptoName>
              <GrayText color={colorScheme} transform="uppercase">
                {crypto.symbol}
              </GrayText>
            </GrayContainer>
            {/* rank, coin */}
            <GrayContainer pb={40}>
              <GrayText color={colorScheme}>Rank #{crypto.rank}</GrayText>
              <GrayText color={colorScheme}>{crypto.categories2}</GrayText>
            </GrayContainer>
            {/* Links */}
            <GrayContainer pb={5}>
              <SelectLink>bitcoin.org</SelectLink>
              <GrayText color={colorScheme}>{crypto.categories2}</GrayText>
            </GrayContainer>
          </Grid.Col>
          {/* Price */}
          <Grid.Col lg={15}>2</Grid.Col>
        </Grid>
      </Container>
    </Paper>
  );
};
