import { MediaQuery, useMantineColorScheme } from "@mantine/core";
import React from "react";

type Props = {
  firstHeader: string;
  secondHeader: string;
  thirdHeader: string;
  fourthToFifthHeader: string[];
  sixthToNinthHeader: string[];
};

export const TableHeader = ({
  firstHeader,
  secondHeader,
  thirdHeader,
  fourthToFifthHeader,
  sixthToNinthHeader,
}: Props) => {
  const { colorScheme } = useMantineColorScheme();
  const darkmode = colorScheme === "dark" ? "white" : "black";

  return (
    <tr>
      <th style={{ textAlign: "right", color: darkmode }}>{firstHeader}</th>
      <th style={{ textAlign: "left", color: darkmode }}>{secondHeader}</th>
      <th style={{ textAlign: "right", color: darkmode }}>{thirdHeader}</th>
      {fourthToFifthHeader?.map((header) => (
        <MediaQuery
          key={header}
          query="(max-width: 1200px)"
          styles={{ display: "none" }}
        >
          <th style={{ textAlign: "right", color: darkmode }}>{header}</th>
        </MediaQuery>
      ))}
      {sixthToNinthHeader?.map((header) => (
        <th key={header} style={{ textAlign: "right", color: darkmode }}>
          {header}
        </th>
      ))}
    </tr>
  );
};
