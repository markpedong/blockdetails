import { Grid } from "@mantine/core";
import styled from "styled-components";

export const StyledDiv = styled.div`
  display: flex;
  justify-content: end;
  flex-direction: column;
`;

export const Currency = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
`;

export const TRUST_SCORE = styled.span`
  background-color: rgb(22, 199, 132);
  padding: 0.3rem 0.8rem;
  border-radius: 0.3rem;
  color: white;
`;

export const StyledCol = styled(Grid.Col)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
