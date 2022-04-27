import { Tabs, TabsProps, useMantineColorScheme } from "@mantine/core";

export const StyledTabs = (props: TabsProps) => {
  const { colorScheme } = useMantineColorScheme();

  const border = colorScheme === "dark" ? "#2C2E33" : "#e9ecef";
  return (
    <Tabs
      variant="unstyled"
      styles={(theme) => ({
        tabsListWrapper: {
          borderBlock: `0.8px solid ${border}`,
        },
        tabControl: {
          color: theme.colorScheme === "dark" ? "white" : "black",
          fontSize: theme.fontSizes.sm,
          fontWeight: "700",
          margin: `${theme.spacing.sm}px  0.5rem`,
          paddingInline: "1rem",
        },

        tabActive: {
          backgroundColor: theme.colors.blue[7],
          borderColor: theme.colors.blue[7],
          color: theme.white,
          borderRadius: theme.radius.md,
        },
      })}
      {...props}
    />
  );
};

export const StyledPriceTabs = (props: TabsProps) => {
  return (
    <Tabs
      variant="unstyled"
      styles={(theme) => ({
        tabsListWrapper: {
          borderRadius: theme.radius.sm,
          border: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4]
          }`,
          inlineSize: "fit-content",
        },
        tabControl: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[0]
              : theme.colors.gray[9],
          fontWeight: "600",
          fontSize: theme.fontSizes.xs,
          padding: `0px ${theme.spacing.lg}px`,
        },

        tabActive: {
          backgroundColor: theme.colors.gray[2],
          color: theme.black,
          borderRadius: theme.radius.sm,
        },
      })}
      {...props}
    />
  );
};
