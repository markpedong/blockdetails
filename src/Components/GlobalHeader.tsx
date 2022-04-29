import React from "react";
import { TopHeader } from "../Theme/CreateStyles/Global";

type Props = {
  title?: string;
  symbol?: string;
  data?: number | string;
  percentage?: string;
};

export const GlobalHeader = ({ title, data, symbol, percentage }: Props) => {
  const { classes } = TopHeader();
  return (
    <>
      {title}
      <span className={classes.digits}>
        {symbol} {data} {percentage}
      </span>
    </>
  );
};
