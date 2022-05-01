import {
  Avatar,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Select,
  Text,
} from "@mantine/core";
import React, { forwardRef } from "react";
import { data } from "../../Config/Variable";
import project from "../../Images/project.svg";
import { ItemProps } from "../../Type/Project";

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

export const Project = () => {
  return (
    <Paper>
      <Container size="xl" px="xs" py="xl">
        <Grid>
          <Grid.Col xs={5}>
            <Text pt="3rem" size="xl" weight="bolder" transform="uppercase">
              Blockchain Network
            </Text>
            <Text size="sm" color="dimmed" pb="1rem">
              Check out which projects are listed on a certain network. And
              checkout where are they listed on major exchanges!
            </Text>
            <Text size="sm" color="dimmed" pb="1rem">
              Why should you be aware of the projects available on different
              blockchains? <br /> Because you'll be able to move tokens and
              currencies between networks and see where they are listed on major
              exchanges
            </Text>
            <Select
              clearable
              label="Choose a Network:"
              placeholder="e.g. Ethereum, Avalanche, etc."
              itemComponent={SelectItem}
              data={data}
              searchable
              maxDropdownHeight={400}
              nothingFound="Nobody here"
              filter={(value, item) =>
                item?.label
                  ?.toLowerCase()
                  .includes(value.toLowerCase().trim()) ||
                item.description
                  .toLowerCase()
                  .includes(value.toLowerCase().trim())
              }
            />
          </Grid.Col>
          <Grid.Col xs={7} p="3rem">
            <Image src={project} alt="project" />
          </Grid.Col>
        </Grid>
      </Container>
    </Paper>
  );
};
