import { createStyles } from "@mantine/core";
import { HEADER_HEIGHT } from "../../Config/Variable";

export const NavStyles = createStyles((theme) => ({
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
    paddingBlockEnd: theme.spacing.xs,
    paddingInline: theme.spacing.xs,

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
    justifyContent: "center",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[0]
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
}));
