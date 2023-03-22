import { Layout } from "antd";
import React from "react";

const Header = () => {
  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    height: "20vh",
    paddingInline: 50,
    lineHeight: "64px",
    backgroundColor: "#7dbcea",
  };
  return <Layout.Header style={headerStyle}>Header</Layout.Header>;
};

export default Header;
