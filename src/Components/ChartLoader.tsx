import React from "react";
import { LoaderComp } from "./Loader";

export const ChartComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        blockSize: 420,
      }}
    >
      <LoaderComp />
    </div>
  );
};
