import Cryptocurrency from "@/app/cryptocurrency/page";
import Exchanges from "@/app/exchanges/page";
import { ClusterOutlined, GlobalOutlined } from "@ant-design/icons";

export default [
  {
    path: "/cryptocurrency",
    name: "Cryptocurrency",
    element: <Cryptocurrency />,
    icon: <GlobalOutlined />,
  },
  {
    path: "/exchanges",
    name: "Exchanges",
    element: <Exchanges />,
    icon: <ClusterOutlined />,
  },
];
