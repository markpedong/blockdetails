import { ProColumnType, ProTable } from "@ant-design/pro-components";
import { Layout } from "antd";
import { getAllCoins } from "../../api";
import { PRO_TABLE_PROPS } from "../../constants";

type Props = {};

const App = () => {
  const columns: ProColumnType[] = [
    {
      title: "#",
      align: "right",
    },
    {
      title: "Name",
      align: "left",
    },
    {
      title: "Price",
      align: "right",
    },
  ];

  const getAllData = async (params: {}) => {
    const data = await getAllCoins({ ...params, currency: "usd" });

    console.log(data.data.data);

    return {};
  };

  return (
    <Layout.Content>
      <ProTable {...PRO_TABLE_PROPS} columns={columns} request={getAllData} />
    </Layout.Content>
  );
};

export default App;
