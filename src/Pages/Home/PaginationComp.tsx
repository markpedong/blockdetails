import {
  Container,
  Grid,
  Pagination,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { GlobalState } from "../../Context/GlobalContext";
import { TableState } from "../../Context/TableContext";
import { ShowRow } from "./ShowRow";

export const PaginationComp = () => {
  const { colorScheme } = useMantineTheme();
  const { page, setPage, coins, loading } = TableState();
  const { global } = GlobalState();

  const first = Object.values(coins)[0];
  const last = Object.values(coins)[99];
  return loading ? (
    <>{""}</>
  ) : (
    <Grid py={"xl"} columns={24} align={"center"}>
      <Grid.Col sm={6}>
        <Text size="sm" weight={"bold"}>
          Showing {first?.market_cap_rank} - {last?.market_cap_rank} out of{" "}
          {global.active}
        </Text>
      </Grid.Col>
      <Grid.Col sm={12}>
        <Pagination
          total={137}
          color={colorScheme === "dark" ? "indigo" : ""}
          size="md"
          radius="md"
          withEdges
          position="center"
          page={page}
          onChange={(e) => setPage(e)}
          sx={{
            "& > button": {
              fontFamily: "Inter",
            },
          }}
        />
      </Grid.Col>
      <Grid.Col sm={6}>
        <ShowRow />
      </Grid.Col>
    </Grid>
  );
};
