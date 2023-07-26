import { Inter } from "next/font/google";
import React from "react";
import StyledComponentsRegistry from "../lib/AntdRegistry";
import "./globals.css";
import ProLayout from "@/components/ProLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Block Details",
  description: "Coinmarketcap clone",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <StyledComponentsRegistry>
        <ProLayout>{children}</ProLayout>
      </StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;
