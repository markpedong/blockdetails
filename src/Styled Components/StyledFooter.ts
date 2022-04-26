import styled from "styled-components";
import { Text } from "@mantine/core";

type FooterHeader = {
  colors: string;
  hovercolor: string;
};
export const FooterHeader = styled(Text)`
  color: ${(props: FooterHeader) => props.colors};
  font-weight: 800;
  margin-block-end: 1rem;
`;

export const FooterLink = styled(Text)`
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${(props: FooterHeader) => props.hovercolor};
  }
`;

export const FooterLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
