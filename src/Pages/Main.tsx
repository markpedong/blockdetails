import React from "react";
import { Route, Routes } from "react-router-dom";
import { SinglePage } from "../Context/CoinContext";
import { Exchanges } from "./CryptoDetails/Exchanges";
import { NFT } from "./CryptoDetails/NFT";
import { Footer } from "./Footer";
import { GlobalData } from "./GlobalData";
import { Home } from "./Home";
import { NavbarSec } from "./Navbar";

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
      </Routes>
      <Footer />
    </>
  );
};
