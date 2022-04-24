import { Loader, SimpleGrid, useMantineColorScheme } from "@mantine/core";
import React from "react";
import { CarouselStyles } from "../Theme/CreateStyles/Carousel";

export const LoaderComp = () => {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = CarouselStyles();

  return (
    <>
      <SimpleGrid cols={1} className={classes.loader}>
        <Loader
          variant="bars"
          size="lg"
          color={colorScheme === "dark" ? "blue" : "indigo"}
        />
      </SimpleGrid>
    </>
  );
};
