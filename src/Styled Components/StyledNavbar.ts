import styled from "styled-components";
import { Grid } from "@mantine/core";

export const NavGrid = styled(Grid)`
  @media screen and (max-width: 576px) {
    display: grid;
    grid-template-columns: 5fr 2fr 1fr;
    align-items: center;
  }
`;
