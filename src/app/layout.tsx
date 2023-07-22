import { Inter } from "next/font/google";
import React from "react";
import StyledComponentsRegistry from "../lib/AntdRegistry";
import "./globals.css";
import Layout from "@/app/components/pro-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Block Details",
  description: "Coinmarketcap clone",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <StyledComponentsRegistry>
        <Layout>{children}</Layout>
      </StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;
