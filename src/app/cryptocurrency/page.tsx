"use client";

import { ModalForm, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";

export default function Cryptocurrency() {
  return (
    <div>
      Cryptocurrency
      <ModalForm trigger={<Button type="primary">OPEN</Button>}></ModalForm>
      <ProTable />
    </div>
  );
}
