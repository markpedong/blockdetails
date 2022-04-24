import { Paper } from "@mantine/core";
import styled from "styled-components";
import { TProfitChange } from "../Type/type";

export const CarouselPaper = styled(Paper)`
  background-color: transparent;
  font-weight: var(--font-weight-7);
`;

export const ProfitChange = styled.span`
  color: ${({ profit }: TProfitChange) => (profit ? "#16c784" : "#ea3943")};
  margin-inline-start: 0.5rem;
  display: inline-flex;
  align-items: baseline;
  font-weight: var(--font-weight-7);

  svg {
    align-self: center;
  }
`;
