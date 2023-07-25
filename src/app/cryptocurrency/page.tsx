"use client";

import { PRO_TABLE_PROPS } from "@/constants";
import { ProColumns, ProTable } from "@ant-design/pro-components";

async function getCryptocurrency() {
  const res = await fetch(
    "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    {
      headers: {
        "X-CMC_PRO_API_KEY": "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c",
      },
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const columns: ProColumns[] = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Price",
    dataIndex: "price",
  },
];

export default async function Cryptocurrency() {
  const getTableData = async () => {
    const data = await getCryptocurrency();

    return {
      data: data.data?.map((coin) => ({
        ...coin,
        price: coin?.quote?.USD?.price,
      })),
    };
  };

  return (
    <ProTable {...PRO_TABLE_PROPS} columns={columns} request={getTableData} />
  );
}
