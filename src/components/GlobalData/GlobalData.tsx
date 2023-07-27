"use client";

import { Space } from "antd";
import dynamic from "next/dynamic";

async function getGlobalData() {
  const res = await fetch(
    "https://sandbox-api.coinmarketcap.com/v1/global-metrics/quotes/latest",
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

export default async function GlobalData() {
  const data = await getGlobalData();

  console.log(data?.data);
  return (
    <Space>
      <div>Cryptos:</div>
    </Space>
  );
}
