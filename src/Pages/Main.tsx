import React from "react";
import { Route, Routes } from "react-router-dom";
import { CryptoDetail } from "./Crypto/CryptoDetail";
import { Exchanges } from "./Crypto/Exchanges";
import { NFT } from "./Crypto/NFT";
import { Footer } from "./Footer";
import { GlobalData } from "./GlobalData";
import { Home } from "./Home";
import { NavbarSec } from "./Home/Navbar";

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
        <Route path="/cryptocurrency/:id" element={<CryptoDetail />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/nft" element={<NFT />} />
      </Routes>
      <Footer />
    </>
  );
};
