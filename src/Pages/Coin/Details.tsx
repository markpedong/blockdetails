import {
  Container,
  Grid,
  Image,
  Paper,
  Tabs,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import { RiArrowDropRightLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useCoinContext } from "../../Context/CoinContext";
import { MarketContext } from "../../Context/MarketContext";
import {
  CryptoName,
  GrayContainer,
  GrayText,
} from "../../StyledComponents/StyledCrypto";
import { StyledTabs } from "../../Theme/CreateStyles/CryptoDetails";
import { CoinNameLinks } from "./Links";
import { Price } from "./Price";
import { Market } from "./Tabs/Market";
import { Overview } from "./Tabs/Overview";
import { Wallet } from "./Tabs/Walllet";

export const CryptoDetail = () => {
  const { colorScheme } = useMantineColorScheme();
  const { crypto } = useCoinContext();

  let navigate = useNavigate();

  return (
    <Paper sx={{ borderRadius: 0 }}>
      <Container size="xl" px="xs" py="xl">
        {/* Categories Header */}
        <div style={{ display: "flex" }}>
          <Text
            size="xs"
            weight="bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            {crypto.categories1}
          </Text>
          <RiArrowDropRightLine />
          <Text
            size="xs"
            weight="bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            {crypto.categories2}
          </Text>
          <RiArrowDropRightLine />
          <Text size="xs" weight="bold">
            {crypto.name}
          </Text>
        </div>
        {/* Name and Price Container */}
        <Grid columns={24} pt="xl">
          {/* Name */}
          <Grid.Col xs={9} pt="xl">
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
            {/* Coin Links */}
            <CoinNameLinks />
          </Grid.Col>
          {/* Price */}
          <Grid.Col xs={15}>
            <Price />
          </Grid.Col>
        </Grid>
      </Container>
      <Container fluid>
        {/* TABS */}
        <Container size="xl" px="xs">
          <MarketContext>
            <StyledTabs initialTab={0} tabPadding="xl">
              <Tabs.Tab label="Overview">
                <Overview />
              </Tabs.Tab>
              <Tabs.Tab label="Market">
                <Market />
              </Tabs.Tab>
              <Tabs.Tab label="Wallet">
                <Wallet />
              </Tabs.Tab>
            </StyledTabs>
          </MarketContext>
        </Container>
      </Container>
    </Paper>
  );
};
