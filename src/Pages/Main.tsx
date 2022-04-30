import React from "react";
import { Route, Routes } from "react-router-dom";
import { SingleCoinPage } from "../Context/CoinContext";
import { SingleExchangeDetail } from "../Context/ExchangeContext";
import { TableContext } from "../Context/TableContext";
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
      <TableContext>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cryptocurrency/:id" element={<SingleCoinPage />} />
          <Route path="/exchanges" element={<Exchanges />} />
          <Route path="/exchanges/:id" element={<SingleExchangeDetail />} />
          <Route path="/nft" element={<NFT />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </TableContext>
      <Footer />
    </>
  );
};
