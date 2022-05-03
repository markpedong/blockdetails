import {
  ActionIcon,
  Autocomplete,
  Burger,
  Button,
  Container,
  Grid,
  Group,
  Header,
  MediaQuery,
  Modal,
  Paper,
  Select,
  Text,
  Transition,
  useMantineColorScheme,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { forwardRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoonStars, Search, Sun } from "tabler-icons-react";
import { scaleY } from "../Config/Transition";
import { HEADER_HEIGHT } from "../Config/Variable";
import { GlobalState } from "../Context/GlobalContext";
import { useFetchAPISingle } from "../Hooks/useFetchAPISingle";
import logodark from "../Images/logo-darkmode.svg";
import logo from "../Images/logo.svg";
import { NavGrid } from "../StyledComponents/StyledNavbar";
import { NavStyles } from "../Theme/CreateStyles/Navbar";
import { TErrorLoading } from "../Type/type";
import { TrendingCoins } from "./Coin/TrendingCoins";
interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

type Search = TErrorLoading & {
  data: {
    id: string;
    name: string;
    symbol: string;
  }[];
};
export const NavbarSec = ({ links }: HeaderResponsiveProps) => {
  const [value, setValue] = useState("");
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [search, setSearch] = useState(false);
  const [_, setActive] = useState(links[0].link);
  const { classes, cx } = NavStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { setCurrency } = GlobalState();
  const { data } = useFetchAPISingle(
    `https://api.coingecko.com/api/v3/search?query=${value}`
  ) as unknown as Search;
  const navigate = useNavigate();
  const dark = colorScheme === "dark";

  //set a value in data to be used in the autocomplete
  // const dataValue = (data || []).map((item) => ({ ...item, value: item.id }));

  const items = links?.map((link) => (
    <Link
      to={link.link}
      key={link.label}
      className={cx(classes.link)}
      onClick={() => {
        setActive(link.link);
        toggleOpened(false);
      }}
    >
      {link.label}
    </Link>
  ));

  // const result = data?.filter((val) => {
  //   if (value == "") return val;

  //   return val.name.toLowerCase().includes(value.toLowerCase());
  // });

  // console.log(result);

  console.log(data);

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

          <Modal centered opened={search} onClose={() => setSearch(false)}>
            {/* <Select
              searchable
              nothingFound="No Cryptocurrency Found"
              data={result}
              placeholder="eg. Ethereum, Avalanche, Binance"
              label="Search:"
              description="All the data that you can search here are from Coingecko API"
              icon={<MagnifyingGlassIcon fontSize={16} />}
              onChange={(e) => {
                setValue(e as string);
                navigate(`/cryptocurrency/${e}`);
                setSearch(false);
              }}
            /> */}
            <input onChange={(e) => setValue(e.target.value)} />
            <>
              <TrendingCoins setSearch={setSearch} />
            </>
          </Modal>
          <Button
            onClick={() => setSearch(true)}
            variant="light"
            size="sm"
            color="gray"
            radius="xs"
            leftIcon={<Search size={14} />}
          >
            Search for a Crypto!
          </Button>
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
};
