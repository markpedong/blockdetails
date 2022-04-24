import {
  Container,
  Grid,
  Paper,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import logodark from "../Images/logo-darkmode.svg";
import logo from "../Images/logo.svg";
import coinmarketcap_dark from "../Images/coinmarketcap_dark.svg";
import coinmarketcap from "../Images/coinmarketcap.svg";
import coingecko from "../Images/coingecko.svg";
import coingecko_dark from "../Images/coingecko_dark.svg";
import {
  FooterHeader,
  FooterLink,
  FooterLinksContainer,
} from "../Styled Components/StyledFooter";
import {
  API_CG,
  API_CMC,
  Bitcoin,
  BlockChainExplorer,
  BTCTreasury,
  CG,
  CMC,
  CryptoIndices,
  Ethereum,
  News,
  Perpetuals,
  Portfolio,
} from "../Config/Links";

export const Footer = () => {
  const { colorScheme } = useMantineColorScheme();
  const darkmode = colorScheme === "dark" ? "white" : "";
  const hover = colorScheme === "dark" ? "var(--indigo-6)" : "var(--indigo-8)";

  return (
    <Container
      fluid
      style={{
        paddingTop: "var(--size-10)",
        backgroundColor: colorScheme === "dark" ? "#1a1b1e" : "#f5f5f5",
      }}
    >
      <Container size={"xl"} pb={50}>
        <Grid columns={12} pb={50}>
          <Grid.Col
            xs={5}
            md={6}
            sx={{
              display: "flex",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            <img
              src={colorScheme === "dark" ? logodark : logo}
              alt="logo"
              height={30}
            />
            <Text color={darkmode} weight="bold" size="xl">
              BLOCKDETAILS
            </Text>
          </Grid.Col>
          <Grid.Col
            xs={7}
            md={6}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            <FooterLinksContainer>
              <FooterHeader color={darkmode}>Explore</FooterHeader>
              <FooterLink
                color={darkmode}
                href={Bitcoin}
                hoverColor={hover}
                target="_blank"
              >
                Bitcoin
              </FooterLink>
              <FooterLink
                color={darkmode}
                href={Ethereum}
                hoverColor={hover}
                target="_blank"
              >
                Ethereum
              </FooterLink>
              <FooterLink
                color={darkmode}
                href={BlockChainExplorer}
                hoverColor={hover}
                target="_blank"
              >
                BlockChain Explorer
              </FooterLink>
              <FooterLink
                color={darkmode}
                href={CryptoIndices}
                hoverColor={hover}
                target="_blank"
              >
                Crypto Indices
              </FooterLink>
            </FooterLinksContainer>
            <FooterLinksContainer>
              <FooterHeader color={darkmode}>API Used</FooterHeader>
              <FooterLink
                color={darkmode}
                href={API_CMC}
                hoverColor={hover}
                target="_blank"
              >
                CoinMarketCap
              </FooterLink>
              <FooterLink
                color={darkmode}
                href={API_CG}
                hoverColor={hover}
                target="_blank"
              >
                Coingecko
              </FooterLink>
            </FooterLinksContainer>
            <FooterLinksContainer>
              <FooterHeader color={darkmode}>Resources</FooterHeader>
              <FooterLink
                color={darkmode}
                href={API_CG}
                hoverColor={hover}
                target="_blank"
              >
                Coingecko
              </FooterLink>
              <FooterLink
                color={darkmode}
                href={Perpetuals}
                hoverColor={hover}
                target="_blank"
              >
                Perpetuals
              </FooterLink>
              <FooterLink
                color={darkmode}
                href={News}
                hoverColor={hover}
                target="_blank"
              >
                Crypto News
              </FooterLink>
              <FooterLink
                color={darkmode}
                href={BTCTreasury}
                hoverColor={hover}
                target="_blank"
              >
                Bitcoin Treasury
              </FooterLink>
            </FooterLinksContainer>
            <FooterLinksContainer>
              <FooterHeader color={darkmode}>Websites</FooterHeader>
              <FooterLink
                color={darkmode}
                href={CMC}
                hoverColor={hover}
                target="_blank"
              >
                CoinMarketCap
              </FooterLink>
              <FooterLink
                color={darkmode}
                href={CG}
                hoverColor={hover}
                target="_blank"
              >
                Coingecko
              </FooterLink>
              <FooterLink
                color={Portfolio}
                href={CG}
                hoverColor={hover}
                target="_blank"
              >
                Portfolio
              </FooterLink>
            </FooterLinksContainer>
          </Grid.Col>
        </Grid>
        <Grid columns={24}>
          <Grid.Col xs={12}>
            <Text color={darkmode} weight="bold" size="sm">
              © 2022 BlockDetails. All rights reserved
            </Text>
          </Grid.Col>
          <Grid.Col
            xs={12}
            sx={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <Text color={darkmode} weight="bold" size="sm">
              Powered by:
            </Text>
            <img
              src={colorScheme === "dark" ? coinmarketcap_dark : coinmarketcap}
              alt="logo"
              height={25}
            />
            <img
              src={colorScheme === "dark" ? coingecko_dark : coingecko}
              alt="logo"
              height={25}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </Container>
  );
};
