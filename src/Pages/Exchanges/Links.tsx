import { ActionIcon, Text } from "@mantine/core";
import React from "react";
import {
  AiFillFacebook,
  AiFillFlag,
  AiFillRedditCircle,
  AiFillTag,
  AiFillTwitterCircle,
  AiOutlineLink,
} from "react-icons/ai";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { useExchangeContext } from "../../Context/ExchangeContext";
import { GrayContainer } from "../../StyledComponents/StyledCrypto";

const Links = () => {
  const { exchange } = useExchangeContext();
  const links = [
    {
      icon: <BsFillCalendarDateFill fontSize={23} />,
      name: exchange.year,
    },
    {
      icon: <AiFillFlag fontSize={23} />,
      name: exchange.country,
    },
    {
      icon: <AiOutlineLink fontSize={23} />,
      name: exchange.url,
      href: exchange.url,
    },
    {
      icon: <AiFillRedditCircle fontSize={23} />,
      name: "Reddit",
      href: exchange.reddit,
    },
    {
      icon: <AiFillTwitterCircle fontSize={23} />,
      name: "Twitter",
      href: exchange.links.twitter?.[0],
    },
    {
      icon: <AiFillFacebook fontSize={23} />,
      name: "Facebook",
      href: exchange.fb_url,
    },
    {
      icon: <AiFillTag fontSize={23} />,
      name: "Exchange",
    },
  ];

  return (
    <>
      {links?.map((link, index) => (
        <GrayContainer key={index} style={{ paddingTop: "0.5rem" }}>
          {!link.href ? (
            ""
          ) : (
            <>
              <ActionIcon>{link.icon}</ActionIcon>
              <Text
                style={{ color: "blue" }}
                component="a"
                href={link.href}
                target="_blank"
                weight={400}
                size="md"
              >
                {link.name}
              </Text>
            </>
          )}
        </GrayContainer>
      ))}
    </>
  );
};

export default Links;
