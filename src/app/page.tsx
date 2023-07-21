"use client";

import { Button, ConfigProvider } from "antd";
import React from "react";
import theme from "@/theme/*";
import enUS from "antd/lib/locale/en_US";
import { ModalForm, ProLayout } from "@ant-design/pro-components";

const HomePage: React.FC = () => (
  <ConfigProvider theme={theme} locale={enUS}>
    <div className="App">
      <ProLayout></ProLayout>
    </div>
  </ConfigProvider>
);

export default HomePage;
