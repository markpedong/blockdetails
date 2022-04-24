import React from "react";
import { Route, Routes } from "react-router-dom";
import { CryptoDetail } from "./Crypto/CryptoDetail";
import { Exchanges } from "./Crypto/Exchanges";
import { NFT } from "./Crypto/NFT";
import { Home } from "./Home";
import { GlobalData } from "./Home/GlobalData";
import { NavbarSec } from "./Home/Navbar";

export const Main = () => {
  return (
    <div>
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
    </div>
  );
};
