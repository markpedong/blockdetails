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
  query,
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

        <MediaQuery
          query={query ? "(max-width: 1200px)" : ""}
          styles={{ display: "none" }}
        >
          <td className={classes.TablePercentage}>{fourthData}</td>
        </MediaQuery>

        <MediaQuery
          query={query ? "(max-width: 1200px)" : ""}
          styles={{ display: "none" }}
        >
          <td className={classes.TablePercentage}>{fifthData}</td>
        </MediaQuery>

        <td>
          <Text size="xs" className={classes.TableBlack}>
            {sixthData && symbol ? `${symbol} ${sixthData}` : sixthData}
          </Text>
        </td>

        <td>
          <Text size="xs" className={classes.TableBlack}>
            {seventhData && symbol ? `${symbol} ${seventhData}` : seventhData}
          </Text>
        </td>
        <td>
          <Text size="xs" className={classes.TableBlack}>
            {eighthData && symbol ? `${symbol} ${eighthData}` : eighthData}
          </Text>
        </td>
        {ninthData && (
          <td>
            <Text
              size="xs"
              transform="uppercase"
              className={classes.TableBlack}
            >
              {ninthData}
            </Text>
          </td>
        )}
      </tr>
    </>
  );
};
