import React from "react";
import { Route, Routes } from "react-router-dom";
import { CryptoDetail } from "../Crypto/CryptoDetail";
import { Exchanges } from "../Crypto/Exchanges";
import { NFT } from "../Crypto/NFT";
import { GlobalData } from "./GlobalData";
import { Home } from "./Home";
import { NavbarSec } from "./Navbar";

export const Main = () => {
  return (
    <div>
      <GlobalData />
      <NavbarSec />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cryptocurrency/:id" element={<CryptoDetail />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/nft" element={<NFT />} />
      </Routes>
    </div>
  );
};
