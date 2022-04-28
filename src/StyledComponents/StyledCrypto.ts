import { Container, Grid, Paper, Select, Text } from "@mantine/core";
import styled from "styled-components";

type StyledColor = {
  color: string;
  profit: boolean;
};
export const CryptoName = styled(Text)`
  color: ${({ color }: StyledColor) => (color === "dark" ? "#fff" : "#000")};
  font-size: 2rem;
  font-weight: 800;
`;

export const GrayText = styled(Text)`
  color: ${({ color }: StyledColor) =>
    color === "dark" ? "#a1a7bb" : "#58667e"};
  font-size: 0.7rem;
  font-weight: 600;
  background-color: ${({ color }: StyledColor) =>
    color === "dark" ? "#323546" : "#eff2f5"};
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-2);
`;

export const GrayContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

export const GrayContainerLinks = styled(Paper)`
  display: flex;
  align-items: center;
  font-weight: 600;
  border-radius: var(--radius-2);
  gap: 0.5rem;
  color: ${({ color }: StyledColor) => (color === "dark" ? "white" : "black")};
  background-color: ${({ color }: StyledColor) =>
    color === "dark" ? "#323546" : "#eff2f5"};
  padding: 0.2rem 0.4rem;
  inline-size: max-content;
`;

export const GrayTextLink = styled(Text)`
  font-size: 0.7rem;
  cursor: pointer;
`;

export const PriceChange = styled(Text)`
  display: flex;
  gap: 0.2rem;
  align-items: center;
  background-color: ${({ profit }: StyledColor) =>
    profit ? "#16c784" : "#ea3943"};
  color: #fff;
  padding: 0.3rem 0.5rem;
  border-radius: var(--radius-2);
`;

export const WhiteText = styled(Text)`
  color: ${({ color }: StyledColor) => (color === "dark" ? "white" : "black")};
`;

export const LowHigh = styled(Text)`
  color: ${({ color }: StyledColor) =>
    color === "dark" ? "#a1a7bb" : "#58667e"};
  max-width: fit-content;

  font-weight: 600;
  font-size: 0.8rem;
`;

export const LowHighSpan = styled.span`
  color: ${({ color }: StyledColor) => (color === "dark" ? "white" : "black")};
  font-weight: 800;
`;

export const StyledDesc = styled(Text)`
  color: ${({ color }: StyledColor) => (color === "dark" ? "white" : "black")};
  font-size: 1.5rem;
`;

export const SpanUpperCase = styled.span`
  text-transform: uppercase;
`;

export const StyledDesc2 = styled(Text)`
  font-size: 1.5rem;
`;

export const StyledText = styled(Text)`
  color: ${({ color }: StyledColor) =>
    color === "dark" ? "#a1a7bb" : "#58667e"};
  font-weight: 600;
  font-size: 0.9rem;
`;

export const StyledNum = styled(Text)`
  color: ${({ color }: StyledColor) => (color === "dark" ? "white" : "black")};
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
`;

export const StyledContainer = styled(Container)`
  background-color: ${({ color }: StyledColor) =>
    color === "dark" ? "#2C2E33" : "#eff2f5"};
  box-shadow: var(--shadow-2);
  border-radius: var(--radius-2);
  padding-block: 2rem;
`;

// backgroundColor:
// colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.white,
// boxShadow: "var(--shadow-2)",
// borderRadius: "var(--radius-2)",
// paddingBlock: "2rem",
// marginTop: "3rem",
