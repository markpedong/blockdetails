import React from "react";
import axios from "axios";
import { MenuItem, Select } from "@mui/material";
import { GlobalState } from "../../Context/GlobalContext";

export const GlobalData = () => {
  const { currency, setCurrency } = GlobalState();
  return (
    <div>
      <div>GlobalData</div>
      <Select
        defaultValue="USD"
        variant="standard"
        style={{
          width: 100,
          height: 40,
          marginBlock: 10,

          fontFamily: "Inter, Sans Serif",
        }}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <MenuItem value={"USD"}>USD</MenuItem>
        <MenuItem value={"PHP"}>PHP</MenuItem>
      </Select>
    </div>
  );
};
