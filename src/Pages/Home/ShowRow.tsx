import { Container, Grid, Select, Text } from "@mantine/core";
import React from "react";
import { TableState } from "../../Context/TableContext";

export const ShowRow = () => {
  const { setResPage, res_page } = TableState();
  return (
    <Container
      fluid
      sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      px={0}
    >
      <Text weight={"bold"} size="sm" style={{ whiteSpace: "nowrap" }}>
        Show Rows
      </Text>

      <Select
        placeholder={`${res_page}`}
        data={
          [
            { value: 100, label: "100" },
            { value: 75, label: "75" },
            { value: 50, label: "50" },
            { value: 25, label: "25" },
          ] as any
        }
        onChange={(e) => setResPage(e as unknown as number)}
      />
    </Container>
  );
};
