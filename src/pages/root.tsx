import { Layout, Space } from "antd";
import Header from "../components/header";
import App from "./app";

const { Content } = Layout;

const Root = () => {
  return (
    <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
      <Layout>
        <Header />
        <App />
      </Layout>
    </Space>
  );
};

export default Root;
