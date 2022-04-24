import styled from "styled-components";
import { Text } from "@mantine/core";

type FooterHeader = {
  colors: string;
  hoverColor: string;
};
export const FooterHeader = styled(Text)`
  color: ${(props: FooterHeader) => props.colors};
  font-weight: 800;
  margin-block-end: 1rem;
`;

export const FooterLink = styled.a`
  color: ${(props: FooterHeader) => props.colors};
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    color: ${(props: FooterHeader) => props.hoverColor};
  }
`;

export const FooterLinksContainer = styled.span`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
