import {
  ActionIcon,
  Burger,
  Button,
  Container,
  Grid,
  Group,
  Header,
  MediaQuery,
  Paper,
  Select,
  Text,
  Transition,
  useMantineColorScheme,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoonStars, Search, Sun } from "tabler-icons-react";
import { ModalComponent } from "../Components/ModalComponent";
import { SEARCH_FILTER } from "../Config/API";
import { scaleY } from "../Config/Transition";
import { HEADER_HEIGHT } from "../Config/Variable";
import { GlobalState } from "../Context/GlobalContext";
import { useFetchAPISingle } from "../Hooks/useFetchAPISingle";
import logodark from "../Images/logo-darkmode.svg";
import logo from "../Images/logo.svg";
import { NavGrid } from "../StyledComponents/StyledNavbar";
import { NavStyles } from "../Theme/CreateStyles/Navbar";
import { TSearch } from "../Type/Navbar";
interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

export const NavbarSec = ({ links }: HeaderResponsiveProps) => {
  const [search, setSearch] = useState(false);
  const [value, setValue] = useState("");
  const [opened, toggleOpened] = useBooleanToggle(false);
  // eslint-disable-next-line
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = NavStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { setCurrency } = GlobalState();
  const navigate = useNavigate();
  const dark = colorScheme === "dark";
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

  const { data } = useFetchAPISingle(
    SEARCH_FILTER(value)
  ) as unknown as TSearch;

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

          <ModalComponent
            data={data}
            search={search}
            setSearch={setSearch}
            setValue={setValue}
            value={value}
          />
          <Button
            onClick={() => {
              toggleOpened(false);
              setSearch(true);
            }}
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
                  <ModalComponent
                    data={data}
                    search={search}
                    setSearch={setSearch}
                    setValue={setValue}
                    value={value}
                  />
                  <Text
                    align="center"
                    onClick={() => {
                      toggleOpened(false);
                      setSearch(true);
                    }}
                    size="sm"
                    color="gray"
                    style={{ backgroundColor: "rgba(248, 249, 250, 1)" }}
                    py="0.5rem"
                  >
                    Search for a Crypto!
                  </Text>
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
