import {
  ActionIcon,
  Autocomplete,
  Burger,
  Container,
  Grid,
  Group,
  Header,
  MediaQuery,
  Paper,
  Select,
  Transition,
  useMantineColorScheme,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoonStars, Sun } from "tabler-icons-react";
import { scaleY } from "../Config/Transition";
import { GlobalState } from "../Context/GlobalContext";
import { NavGrid } from "../Styled Components/StyledNavbar";
import { HEADER_HEIGHT } from "../Config/Variable";
import { NavStyles } from "../Theme/CreateStyles/Navbar";
import logodark from "../Images/logo-darkmode.svg";
import logo from "../Images/logo.svg";
interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

export function NavbarSec({ links }: HeaderResponsiveProps) {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = NavStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { setCurrency } = GlobalState();
  const navigate = useNavigate();

  const items = links.map((link) => (
    <Link
      to={link.link}
      key={link.label}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={() => {
        setActive(link.link);
        toggleOpened(false);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container size={"xl"} px={"xs"} className={classes.header}>
        <Paper
          className={classes.brand}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          <img src={dark ? logodark : logo} alt="logo" height={20} />
          <span>BLOCKDETAILS</span>
        </Paper>
        <Group spacing={5} className={classes.links}>
          {items}
          <Autocomplete
            placeholder="Search"
            icon={<MagnifyingGlassIcon fontSize={16} />}
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
          />
        </Group>

        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="md"
        />

        <Transition
          transition={scaleY}
          duration={200}
          timingFunction="ease"
          mounted={opened}
        >
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}

              <NavGrid>
                <Grid.Col xs={9} sm={8}>
                  <Autocomplete
                    placeholder="Search"
                    icon={<MagnifyingGlassIcon fontSize={16} />}
                    data={[
                      "React",
                      "Angular",
                      "Vue",
                      "Next.js",
                      "Riot.js",
                      "Svelte",
                      "Blitz.js",
                    ]}
                  />
                </Grid.Col>
                <MediaQuery
                  query="(max-width: 645px)"
                  styles={{ display: "none" }}
                >
                  <Grid.Col xs={0} sm={1} />
                </MediaQuery>
                <Grid.Col xs={1.7}>
                  <Select
                    placeholder="Change Currency"
                    onChange={(e) => setCurrency(e as string)}
                    defaultValue={"usd"}
                    size="xs"
                    data={[
                      { value: "usd", label: "USD" },
                      { value: "php", label: "PHP" },
                      { value: "jpy", label: "JPY" },
                      { value: "eur", label: "EUR" },
                    ]}
                  />
                </Grid.Col>
                <Grid.Col xs={1}>
                  <ActionIcon
                    variant="outline"
                    color={dark ? "white" : "blue"}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                  >
                    {dark ? <Sun size={18} /> : <MoonStars size={18} />}
                  </ActionIcon>
                </Grid.Col>
              </NavGrid>
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
