import { Image, MediaQuery, Text } from "@mantine/core";
import React from "react";
import { TableStyles } from "../Theme/CreateStyles/Table";
import { TTableComponent } from "../Type/type";

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
}: TTableComponent) => {
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
            {sixthData ? `${symbol} ${sixthData}` : ""}
          </Text>
        </td>

        <td>
          <Text size="xs" className={classes.TableBlack}>
            {seventhData ? `${symbol} ${seventhData}` : ""}
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
