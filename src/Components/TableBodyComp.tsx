import { Image, MediaQuery, Table, Text, useMantineTheme } from "@mantine/core";
import React, { ReactNode } from "react";
import { TableState } from "../Context/TableContext";
import { TableStyles } from "../Theme/CreateStyles/Table";
import { CryptoTable } from "../Type/type";

type Props = {
  alt: string;
  name: string;
  name_symbol?: string;
  eighthData?: string | number;
  fifthData?: string | ReactNode;
  fourthData?: string | ReactNode;
  image: string;
  id: string;
  navigateCrypto: (id: string) => void;
  ninthData?: string | number | ReactNode;
  rank: string | number;
  seventhData?: string;
  sixthData?: string | number;
  symbol?: string;
  thirdData?: string | ReactNode;
};

export const TableComponent = ({
  alt,
  name,
  name_symbol,
  eighthData,
  fifthData,
  fourthData,
  image,
  id,
  navigateCrypto,
  ninthData,
  rank,
  seventhData,
  sixthData,
  symbol,
  thirdData,
}: Props) => {
  const { classes } = TableStyles();

  return (
    <>
      <tr>
        <td className={classes.rank}>{rank}</td>
        <td className={classes.TableName}>
          <Image radius={"lg"} src={image} alt={alt} width={22} height={22} />
          <Text
            size="xs"
            sx={{ cursor: "pointer" }}
            onClick={() => navigateCrypto(id)}
          >
            {name}
          </Text>
          <Text size="xs" color="dimmed" transform="uppercase">
            {name_symbol}
          </Text>
        </td>
        <td>
          <Text size="xs" className={classes.TableBlack}>
            {symbol} {thirdData}
          </Text>
        </td>
        <MediaQuery query="(max-width: 1200px)" styles={{ display: "none" }}>
          <td className={classes.TablePercentage}>{fourthData}</td>
        </MediaQuery>

        <MediaQuery query="(max-width: 1200px)" styles={{ display: "none" }}>
          <td className={classes.TablePercentage}>{fifthData}</td>
        </MediaQuery>

        <td>
          <Text size="xs" className={classes.TableBlack}>
            {symbol} {sixthData}
          </Text>
        </td>

        <td>
          <Text size="xs" className={classes.TableBlack}>
            {symbol} {seventhData}
          </Text>
        </td>
        <td>
          <Text size="xs" className={classes.TableBlack}>
            {eighthData}
          </Text>
        </td>
        <td>
          <Text size="xs" transform="uppercase" className={classes.TableBlack}>
            {ninthData}
          </Text>
        </td>
      </tr>
    </>
  );
};
