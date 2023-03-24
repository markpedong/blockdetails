import { ProColumnType, ProTable } from '@ant-design/pro-components';
import { Image, Layout, Space, Typography } from 'antd';
import { useConcent } from 'concent';
import { useNavigate } from 'react-router-dom';
import { CoinData, getAllCoins } from '../../api';
import { PRO_TABLE_PROPS } from '../../constants';

const App = () => {
	const { state } = useConcent('$$global');
	const { currency, symbol } = state;
	const navigate = useNavigate();

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
							onClick={() => navigate('/cryptocurrency')}
						/>
						<Typography.Link onClick={() => navigate('/cryptocurrency')}>
							{record.name}
						</Typography.Link>
					</Space>
				);
			},
		},
		{
			title: 'Price',
			align: 'right',
			dataIndex: 'current_price',
			render: (_, record) => (
				<Space>
					<span>{symbol}</span>
					<span>{record.current_price}</span>
				</Space>
			),
		},
		{
			title: '24%',
			align: 'center',
			dataIndex: 'price_change_percentage_24h',
			render: (_, record) => (
				<span
					style={{
						color: record.price_change_percentage_24h > 0.0 ? '#16c784' : '#ea3943',
					}}
				>
					{record.price_change_percentage_24h.toFixed(2).replace('-', '')}
				</span>
			),
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
