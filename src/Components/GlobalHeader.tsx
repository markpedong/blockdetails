import { CSSProperties } from "@mantine/styles/lib/tss/types/css-object";
import React from "react";
import { useStyles } from "../Theme/GlobalHeader";

type Props = {
  title?: string;
  symbol?: string;
  data?: number | string;
  percentage?: string;
};

export const GlobalHeader = ({ title, data, symbol, percentage }: Props) => {
  const { classes } = useStyles();
  return (
    <>
      {title}
      <span className={classes.digits}>
        {symbol} {data} {percentage}
      </span>
    </>
  );
};
