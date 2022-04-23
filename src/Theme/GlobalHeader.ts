import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  digits: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.indigo[8]
        : theme.colors.indigo[7],
    marginInlineStart: theme.spacing.xs,
  },
}));
