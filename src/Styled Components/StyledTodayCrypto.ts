import { Paper, Text } from "@mantine/core";
import React from "react";
import styled from "styled-components";

export const TodayContainer = styled(Paper)`
  margin-block: 2rem;
  background-color: inherit;
`;

type TodayCryptoProps = {
  theme: string;
};

export const TodayTitle = styled(Text)`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }: TodayCryptoProps) =>
    theme === "dark" ? "#fff" : "#000"};
`;
