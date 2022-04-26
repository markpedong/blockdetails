import {
  Container,
  Grid,
  Image,
  Menu,
  Paper,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { CaretDownIcon } from "@radix-ui/react-icons";
import React from "react";
import {
  RiArrowDropRightLine,
  RiExternalLinkFill,
  RiSearch2Line,
  RiCodeSSlashFill,
} from "react-icons/ri";
import {
  CryptoName,
  GrayContainer,
  GrayContainerLinks,
  GrayText,
  GrayTextLink,
} from "../../Styled Components/StyledCrypto";
import { CgLink } from "react-icons/cg";

import { TCrypto } from "../../Type/type";
import { useCoinContext } from "../../Context/CoinContext";
import { CoinNameLinks } from "./CoinNameLinks";

export const CryptoDetail = () => {
  const { colorScheme } = useMantineColorScheme();
  const { crypto } = useCoinContext();

  console.log(crypto);
  return (
    <Paper sx={{ borderRadius: 0 }}>
      <Container size="xl" px="xs" pt="xl">
        {/* Categories Header */}
        <Paper sx={{ display: "flex" }}>
          <Text size="xs" weight="bold">
            {crypto.categories1}
          </Text>
          <RiArrowDropRightLine />
          <Text size="xs" weight="bold">
            {crypto.categories2}
          </Text>
          <RiArrowDropRightLine />
          <Text size="xs" weight="bold">
            {crypto.name}
          </Text>
        </Paper>
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
            <CoinNameLinks />
          </Grid.Col>
          {/* Price */}
          <Grid.Col xs={15}>2</Grid.Col>
        </Grid>
      </Container>
    </Paper>
  );
};
