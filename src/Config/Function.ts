import { useNavigate } from "react-router-dom";

export const numberWithCommas = (x: number) =>
  x > 1
    ? x
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : x;
