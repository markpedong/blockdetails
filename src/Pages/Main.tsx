import React from "react";
import { Route, Routes } from "react-router-dom";
import { SinglePage } from "../Context/CoinContext";
import { Exchanges } from "./Exchanges/Exchanges";
import { Footer } from "./Footer";
import { GlobalData } from "./GlobalData";
import { Home } from "./Home";
import { NavbarSec } from "./Navbar";
import { NFT } from "./NFT/NFT";
import { ErrorPage } from "./Other/Error";

export const Main = () => {
  return (
    <>
      <GlobalData />
      <NavbarSec
        links={[
          { link: "/", label: "Crypto" },
          { link: "/exchanges", label: "Exchanges" },
          { link: "/nft", label: "NFT" },
        ]}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cryptocurrency/:id" element={<SinglePage />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/nft" element={<NFT />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </>
  );
};
