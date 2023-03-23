import { ProColumnType, ProTable } from '@ant-design/pro-components';
import { Image, Layout, Space, Typography } from 'antd';
import { useConcent } from 'concent';
import { CoinData, getAllCoins } from '../../api';
import { PRO_TABLE_PROPS } from '../../constants';

const App = () => {
	const { state } = useConcent('$$global');
	const { currency } = state;

	const columns: ProColumnType<CoinData>[] = [
		{
			title: '#',
			align: 'right',
			render: (_, _1, index) => index + 1,
		},
		{
			title: 'Name',
			align: 'left',
			dataIndex: 'name',
			render: (_, record) => {
				return (
					<Space>
						<Image
							preview={false}
							src={record.image}
							alt={record.name}
							height={20}
							width={20}
						/>
						<Typography.Link>{record.name}</Typography.Link>
					</Space>
				);
			},
		},
		{
			title: 'Price',
			align: 'right',
			dataIndex: 'current_price',
		},
	];

	const getAllData = async (params: { pageSize: string }) => {
		const data = await getAllCoins({
			vs_currency: currency,
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
