import {
  AppBar,
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../Images/logo.svg";

export const NavbarSec = () => {
  return (
    <AppBar elevation={0} position="static">
      <Divider />
      <Container maxWidth="lg" disableGutters={true}>
        <Toolbar variant="regular">
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <img height="22" src={logo} alt="logo" />
            <Link to={"/"}>
              <Typography marginLeft={1} variant="subtitle1">
                BLOCKDETAILS
              </Typography>
            </Link>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button color="inherit">
              <Link to={"/"}>Coin</Link>
            </Button>
            <Button color="inherit">
              <Link to={"/exchanges"}>Exchanges</Link>
            </Button>
            <Button color="inherit">
              <Link to={"/nft"}>NFT</Link>
            </Button>
          </Stack>
        </Toolbar>
      </Container>
      <Divider />
    </AppBar>
  );
};
