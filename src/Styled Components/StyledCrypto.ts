import { Grid, Paper, Select, Text } from "@mantine/core";
import styled from "styled-components";

type StyledColor = {
  color: string;
};
export const CryptoName = styled(Text)`
  color: ${({ color }: StyledColor) => (color === "dark" ? "#fff" : "#000")};
  font-size: 2rem;
  font-weight: 800;
`;

export const GrayText = styled(Text)`
  color: ${({ color }: StyledColor) =>
    color === "dark" ? "#a1a7bb" : "#58667e"};
  font-size: 0.8rem;
  font-weight: 700;
  background-color: ${({ color }: StyledColor) =>
    color === "dark" ? "#323546" : "#eff2f5"};
  padding: 0.1rem 0.3rem;
  border-radius: var(--radius-2);
`;

export const GrayContainer = styled(Paper)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

export const SelectLink = styled(Select)`
  font-weight: 800;
`;
