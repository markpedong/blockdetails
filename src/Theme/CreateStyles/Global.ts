import { createStyles } from "@mantine/core";

export const TopHeader = createStyles((theme) => ({
  digits: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.indigo[8]
        : theme.colors.indigo[7],
    marginInline: theme.spacing.xs,
  },
}));
