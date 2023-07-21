import React from "react";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold">
            Welcome to{" "}
            <a className="text-blue-600" href="https://nextjs.org">
              Next.js!
            </a>
          </h1>
        </main>
      </div>
    </div>
  );
}

// "use client";

// import logo from "@/assets/logo.svg";
// import menus from "@/menus";
// import theme from "@/theme/*";
// import { ConfigProvider, Typography } from "antd";
// import enUS from "antd/locale/en_US";
// import { cloneDeep } from "lodash";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import Link from "next/link";
// import React, { FC } from "react";

// const ProLayout = dynamic(() => import("@ant-design/pro-layout"), {
//   ssr: false,
// });

// const HomePage = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <ConfigProvider theme={theme} locale={enUS}>
//       <ProLayout
//         // location={{ pathname }}
//         title="Blockdetails"
//         fixSiderbar
//         fixedHeader
//         layout="mix"
//         headerTitleRender={() => (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Image src={logo} alt="logo" width={30} height={30} />
//             <h1>Block Details</h1>
//           </div>
//         )}
//         route={{
//           routes: cloneDeep(menus),
//         }}
//         menuItemRender={(item, dom) => {
//           return (
//             <Link href={item.path as string}>
//               <Typography.Link style={{ paddingBlockStart: "0.5rem" }}>
//                 {dom}
//               </Typography.Link>
//             </Link>
//           );
//         }}
//       >
//         {children}
//       </ProLayout>
//     </ConfigProvider>
//   );
// };

// export default HomePage;
