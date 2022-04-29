import styled from "styled-components";
import { Grid, Text } from "@mantine/core";

type TFooterHeader = {
  colors: string;
  hovercolor: string;
};
export const FooterHeader = styled(Text)`
  color: ${(props: TFooterHeader) => props.colors};
  font-weight: 800;
  margin-block-end: 1rem;
`;

export const StyledText = styled(Text)`
  color: ${({ colors }: TFooterHeader) => (colors === "dark" ? "white" : "")};
`;

export const FooterLink = styled(Text)`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${({ hovercolor }: TFooterHeader) =>
      hovercolor === "dark" ? "var(--indigo-6)" : "var(--indigo-8)"};
  }
`;

export const FooterLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const StyledDiv = styled.div`
  display: flex;
  inline-size: max-content;
  color: ${({ colors }: TFooterHeader) =>
    colors === "dark" ? "white" : "black"};
`;

export const StyledCol = styled(Grid.Col)`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: end;
`;
