"use client";

import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button } from "antd";

export default function Home() {
  return (
    <div>
      <ModalForm title="omega" trigger={<Button type="primary">Omega</Button>}>
        <ProFormText label="omega" />
      </ModalForm>
    </div>
  );
}
