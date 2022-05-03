import { Grid, Pagination, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import { ShowRow } from "./ShowRow";

type Props = {
  first?: number;
  last?: number;
  active?: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setResPage: React.Dispatch<React.SetStateAction<number>>;
  loading?: boolean | null;
  res_page: number;
  total: number;
};

export const PaginationComp = ({
  first,
  last,
  page,
  setPage,
  setResPage,
  active,
  loading,
  res_page,
  total,
}: Props) => {
  const { colorScheme } = useMantineTheme();

  return (
    <Grid py={"xl"} columns={24} align={"center"}>
      <Grid.Col sm={6}>
        <Text size="sm" weight={"bold"}>
          Showing {first} - {last} {active && ` out of ${active}`}
        </Text>
      </Grid.Col>
      <Grid.Col sm={12}>
        <Pagination
          total={total}
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
        <ShowRow res_page={res_page} setResPage={setResPage} />
      </Grid.Col>
    </Grid>
  );
};
