import { createStyles, useMantineColorScheme } from "@mantine/core";

export const TableStyles = createStyles((theme) => ({
  thr: {
    color: theme.colorScheme === "dark" ? "white" : "black",
    textAlign: "end",
  },
  thl: {
    color: theme.colorScheme === "dark" ? "white" : "black",
    textAlign: "end",
  },
  rank: {
    color: theme.colorScheme === "dark" ? "white" : "black",
    fontWeight: "bold",
    textAlign: "right",
  },
  TableName: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "0.5rem",
    fontWeight: "var(--font-weight-8)",
    color: theme.colorScheme === "dark" ? "white" : "black",
    alignItems: "center",
  },

  TableBlack: {
    textAlign: "right",
    color: theme.colorScheme === "dark" ? "white" : "black",
    fontWeight: "bold",
  },

  TablePercentage: {
    textAlign: "right",
    fontWeight: "800",
  },
}));
