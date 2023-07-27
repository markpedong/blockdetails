"use client";

import logo from "@/assets/logo.svg";
import menus from "@/menus";
// import theme from "@/";
import { ActionType } from "@ant-design/pro-components";
import { Typography } from "antd";
import enUS from "antd/lib/locale/en_US";
import { cloneDeep } from "lodash";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const ConfigProvider = dynamic(() =>
  import("antd").then((mod) => mod.ConfigProvider)
);

const ProLayout = dynamic(() =>
  import("@ant-design/pro-components").then((com) => com.ProLayout)
);

const GlobalData = dynamic(() => import("@/components/GlobalData/GlobalData"));

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const actionRef = useRef<ActionType>();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <ConfigProvider locale={enUS}>
      <ProLayout
        location={{ pathname }}
        actionRef={actionRef}
        title="Block Details"
        fixedHeader
        collapsed={collapsed}
        collapsedButtonRender={false}
        route={{ routes: cloneDeep(menus) }}
        layout="mix"
        headerContentRender={() => <GlobalData />}
        menuProps={{
          onMouseEnter: () => setTimeout(() => setCollapsed(false), 150),
          onMouseLeave: () => setTimeout(() => setCollapsed(true), 150),
        }}
        headerTitleRender={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image src={logo} alt="logo" width={30} height={30} />
            <h1>Block Details</h1>
          </div>
        )}
        menuItemRender={(item, dom) => {
          return (
            <Typography.Link
              style={{ paddingBlockStart: "0.5rem" }}
              onClick={() => router.push(item.path as string)}
            >
              {dom}
            </Typography.Link>
          );
        }}
      >
        {children}
      </ProLayout>
    </ConfigProvider>
  );
}
