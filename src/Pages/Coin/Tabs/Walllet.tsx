import {
  Button,
  Collapse,
  Container,
  Image,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { TYPE_OF_WALLETS, WALLETS, WALLETS_DESC } from "../../../Config/Wallet";
import parse from "html-react-parser";

export const Wallet = () => {
  const [opened, setOpen] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  return (
    <Container fluid>
      <Text size="xl" weight="bolder" mb="xl">
        Wallets
      </Text>
      <Text size="sm" weight="inherit" mb="xl">
        We show you the providers so you can make an informed wallet choice to
        store your bitcoin, ether or crypto currency of your choice.{" "}
        <Button
          uppercase
          onClick={() => setOpen((o: boolean) => !o)}
          variant="light"
          radius="xs"
          size="xs"
          compact
        >
          read more
        </Button>
      </Text>
      <Collapse
        style={{ marginTop: "5rem" }}
        transitionDuration={200}
        transitionTimingFunction="linear"
        in={opened}
      >
        {WALLETS_DESC?.map(({ title, description }) => (
          <>
            <Text
              color={colorScheme === "dark" ? "white" : "black"}
              size="md"
              weight="bolder"
            >
              {title}
            </Text>
            {description?.map((desc) => (
              <Text size="sm" my="xl">
                {parse(desc)}
              </Text>
            ))}
          </>
        ))}
        {TYPE_OF_WALLETS?.map((wallet) => (
          <>
            <Text color="#3861FB" size="md" weight="bolder" mt="lg">
              {wallet.title}
            </Text>
            {wallet.description?.map((desc) => (
              <Text size="sm" my="xl">
                {parse(desc)}
              </Text>
            ))}
          </>
        ))}
      </Collapse>
      <Container fluid py="lg">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            justifyContent: "center",
            gap: "16px 30px",
          }}
        >
          {WALLETS.map((wallet) => (
            <div
              style={{
                border: `1px solid ${
                  colorScheme === "dark" ? "#222531" : "#eff2f5"
                }`,
                borderRadius: "8px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Image width="56px" height="56px" src={wallet.img} />
              <Text>{wallet.title}</Text>
              <Text
                size="sm"
                weight="bold"
                style={{
                  opacity: 0.5,
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
                component="a"
                href={wallet.link}
              >
                {wallet.link}
                <ExternalLinkIcon />
              </Text>
              <Button
                component="a"
                href={wallet.link}
                target="_blank"
                variant="light"
                radius="sm"
                size="sm"
                compact
              >
                Visit Website
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </Container>
  );
};
