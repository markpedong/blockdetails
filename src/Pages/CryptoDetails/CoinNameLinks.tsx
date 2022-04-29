import { Container, Menu, useMantineColorScheme } from "@mantine/core";
import { CaretDownIcon } from "@radix-ui/react-icons";
import React from "react";
import { CgLink } from "react-icons/cg";
import {
  RiCodeSSlashFill,
  RiExternalLinkFill,
  RiSearch2Line,
} from "react-icons/ri";
import { removeHTTP } from "../../Config/Function";
import { useCoinContext } from "../../Context/CoinContext";
import {
  GrayContainerLinks,
  GrayTextLink,
} from "../../StyledComponents/StyledCrypto";
import { StyledDiv } from "../../StyledComponents/StyledFooter";

type Props = {};

export const CoinNameLinks = (props: Props) => {
  const { crypto } = useCoinContext();
  const { colorScheme } = useMantineColorScheme();
  const darkColor = colorScheme === "dark" ? "white" : "black";

  return (
    <Container
      fluid
      px={0}
      pt="xl"
      style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}
    >
      {/* Home Page */}
      <GrayContainerLinks size="xs" pb={5} color={colorScheme}>
        <CgLink size={15} />
        <GrayTextLink component="a" href={crypto.home_site} target="_blank">
          {removeHTTP(crypto.home_site)}
        </GrayTextLink>
        <RiExternalLinkFill />
      </GrayContainerLinks>
      {/* Links */}
      <GrayContainerLinks size="xs" pb={5} color={colorScheme}>
        <RiSearch2Line size={15} />
        <GrayTextLink>Explorers</GrayTextLink>
        <Menu
          trigger="hover"
          delay={300}
          transition="pop"
          placement="center"
          position="bottom"
          gutter={20}
          withArrow
          control={<CaretDownIcon />}
        >
          {crypto.scan_site?.map((site) => (
            <Menu.Item key={site}>
              <StyledDiv>
                <a href={site} target="_blank">
                  {removeHTTP(site)} <RiExternalLinkFill />
                </a>
              </StyledDiv>
            </Menu.Item>
          ))}
        </Menu>
      </GrayContainerLinks>
      {/* Forum */}
      <GrayContainerLinks size="xs" pb={5} color={colorScheme}>
        <RiSearch2Line size={15} />
        <GrayTextLink>Forum</GrayTextLink>
        <Menu
          trigger="hover"
          delay={300}
          transition="pop"
          placement="center"
          position="bottom"
          gutter={20}
          withArrow
          control={<CaretDownIcon />}
        >
          {crypto.forum_site?.map((site) => (
            <Menu.Item key={site}>
              <StyledDiv>
                <a href={site} target="_blank">
                  {removeHTTP(site)} <RiExternalLinkFill />
                </a>
              </StyledDiv>
            </Menu.Item>
          ))}
        </Menu>
      </GrayContainerLinks>
      {/* Reddit */}
      {crypto.reddit && (
        <GrayContainerLinks size="xs" pb={5} color={colorScheme}>
          <CgLink size={15} />
          <GrayTextLink component="a" href={crypto.reddit} target="_blank">
            {removeHTTP(crypto.reddit)}
          </GrayTextLink>
          <RiExternalLinkFill />
        </GrayContainerLinks>
      )}
      {/* Source Code */}
      {crypto.source_code?.length > 0 && (
        <GrayContainerLinks size="xs" pb={5} color={colorScheme}>
          <RiCodeSSlashFill size={15} />
          <GrayTextLink>Source Code</GrayTextLink>
          <Menu
            trigger="hover"
            delay={300}
            transition="pop"
            placement="center"
            position="bottom"
            gutter={20}
            withArrow
            control={<CaretDownIcon />}
          >
            {crypto.source_code?.map((site) => (
              <Menu.Item key={site}>
                <StyledDiv>
                  <a href={site} target="_blank">
                    {removeHTTP(site)} <RiExternalLinkFill />
                  </a>
                </StyledDiv>
              </Menu.Item>
            ))}
          </Menu>
        </GrayContainerLinks>
      )}
    </Container>
  );
};
