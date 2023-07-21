import Cryptocurrency from "@/app/cryptocurrency/pages";
import Exchanges from "@/app/exchanges/pages";
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
