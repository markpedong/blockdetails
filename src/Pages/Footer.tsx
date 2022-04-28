import { Container, Grid, Text, useMantineColorScheme } from "@mantine/core";
import React from "react";
import { API_USED, EXPLORE_LINKS, RESOURCES, WEBSITES } from "../Config/Links";
import coingecko from "../Images/coingecko.svg";
import coingecko_dark from "../Images/coingecko_dark.svg";
import coinmarketcap from "../Images/coinmarketcap.svg";
import coinmarketcap_dark from "../Images/coinmarketcap_dark.svg";
import logodark from "../Images/logo-darkmode.svg";
import logo from "../Images/logo.svg";
import {
  FooterHeader,
  FooterLink,
  FooterLinksContainer,
  StyledCol,
  StyledText,
} from "../Styled Components/StyledFooter";

export const Footer = () => {
  const { colorScheme } = useMantineColorScheme();
  const darkmode = colorScheme === "dark" ? "white" : "";

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
            {/* Explore */}
            <FooterLinksContainer>
              <FooterHeader color={darkmode}>Explore</FooterHeader>
              {EXPLORE_LINKS?.map((link) => (
                <FooterLink
                  component="a"
                  href={link.link}
                  hovercolor={colorScheme}
                  target="_blank"
                >
                  {link.name}
                </FooterLink>
              ))}
            </FooterLinksContainer>
            {/* API USED */}
            <FooterLinksContainer>
              <FooterHeader color={darkmode}>API Used</FooterHeader>
              {API_USED?.map((link) => (
                <FooterLink
                  component="a"
                  href={link.link}
                  hovercolor={colorScheme}
                  target="_blank"
                >
                  {link.name}
                </FooterLink>
              ))}
            </FooterLinksContainer>
            {/* RESOURCES */}
            <FooterLinksContainer>
              <FooterHeader color={darkmode}>Resources</FooterHeader>
              {RESOURCES?.map((link) => (
                <FooterLink
                  component="a"
                  href={link.link}
                  hovercolor={colorScheme}
                  target="_blank"
                >
                  {link.name}
                </FooterLink>
              ))}
            </FooterLinksContainer>
            {/* WEBSITES */}
            <FooterLinksContainer>
              <FooterHeader color={darkmode}>Websites</FooterHeader>
              {WEBSITES?.map((link) => (
                <FooterLink
                  component="a"
                  href={link.link}
                  hovercolor={colorScheme}
                  target="_blank"
                >
                  {link.name}
                </FooterLink>
              ))}
            </FooterLinksContainer>
          </Grid.Col>
        </Grid>
        <Grid columns={24}>
          <Grid.Col xs={12}>
            <StyledText>© 2022 BlockDetails. All rights reserved</StyledText>
          </Grid.Col>
          <StyledCol xs={12}>
            <StyledText>Powered by:</StyledText>
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
          </StyledCol>
        </Grid>
      </Container>
    </Container>
  );
};
