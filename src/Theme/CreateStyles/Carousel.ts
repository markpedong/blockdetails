import { createStyles } from "@mantine/core";

export const CarouselStyles = createStyles((theme) => ({
  carousel: {
    display: "grid",
    alignItems: "center",
    inlineSize: "max-content",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.gray[9]
        : theme.colors.gray[0],
    gridTemplateColumns: "auto auto",
    paddingBlock: theme.spacing.xl,
    transition: "all 0.3s var(--ease-5)",
    transform: "scale(0.9)",
    marginBlock: "1rem",
    marginInline: "1rem",
    borderRadius: theme.radius.lg,
    boxShadow: "var(--shadow-2)",
    justifyContent: "space-evenly",

    "&:hover": {
      transform: "scale(1)",
      boxShadow: "var(--shadow-3)",
    },
  },

  description: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    fontFamily: "Inter, sans-serif",
    fontWeight: "var(--font-weight-7)",
    rowGap: "0.5rem",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[0]
        : theme.colors.gray[9],
  },
}));
