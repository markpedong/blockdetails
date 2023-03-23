import { ProColumnType, ProSkeleton, ProTable } from '@ant-design/pro-components';
import { Layout } from 'antd';
import { CoinData, getAllCoins } from '../../api';
import { PRO_TABLE_PROPS } from '../../constants';

type Props = {};

const App = () => {
	const columns: ProColumnType<CoinData>[] = [
		{
			title: '#',
			align: 'right',
		},
		{
			title: 'Name',
			align: 'left',
			dataIndex: 'name',
		},
		{
			title: 'Price',
			align: 'right',
		},
	];

	const getAllData = async (params: { pageSize: string }) => {
		const data = await getAllCoins({
			vs_currency: 'usd',
		});

		console.log(data.data);

		return {
			data: data.data,
		};
	};

	return (
		<Layout.Content>
			<ProTable {...PRO_TABLE_PROPS} columns={columns} request={getAllData} />
		</Layout.Content>
	);
};

export default App;
