import React from "react";
import { useChartContext } from "../../../Context/ChartContext";
import { TableState } from "../../../Context/TableContext";

export const PriceChart = () => {
  const { chart, days, setDays } = useChartContext();

  console.log(chart);
  return <div>PriceChart</div>;
};
