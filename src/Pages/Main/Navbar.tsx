import React, { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  useMantineColorScheme,
  ActionIcon,
  Autocomplete,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import logo from "../../Images/logo.svg";
import logodark from "../../Images/logo-darkmode.svg";
import { Link } from "react-router-dom";
import { MoonStars, Sun } from "tabler-icons-react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,

    [theme.fn.largerThan("lg")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  brand: {
    display: "flex",
    alignItems: "center",

    span: {
      marginInlineStart: "0.5rem",
      fontWeight: 700,
      fontSize: "1.2rem",
      letterSpacing: "0.1rem",
      color:
        theme.colorScheme === "dark"
          ? theme.colors.gray[0]
          : theme.colors.gray[9],
    },
  },

  links: {
    [theme.fn.smallerThan("lg")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("lg")]: {
      display: "none",
    },
  },

  link: {
    display: "flex",
    justifyContent: "end",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("lg")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },

  search: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

export const scaleY = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "top" },
  transitionProperty: "transform, opacity",
};

export function NavbarSec({ links }: HeaderResponsiveProps) {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

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
        <Paper className={classes.brand}>
          <img src={dark ? logodark : logo} alt="logo" height={20} />
          <span>BLOCKDETAILS</span>
        </Paper>
        <Group spacing={5} className={classes.links}>
          {items}
          <Autocomplete
            className={classes.search}
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
              <Container
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Autocomplete
                  sx={{
                    flexGrow: 1,
                  }}
                  className={classes.search}
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
                <ActionIcon
                  variant="outline"
                  color={dark ? "white" : "blue"}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                >
                  {dark ? <Sun size={18} /> : <MoonStars size={18} />}
                </ActionIcon>
              </Container>
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
