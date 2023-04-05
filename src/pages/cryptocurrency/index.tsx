import { CoinData, getAllCoins } from '@/api';
import { PRO_TABLE_PROPS } from '@/constants';
import { formatNumber } from '@/utils';
import { setLocalStorage } from '@/utils/xLocalstorage';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { ActionType, ProColumnType, ProTable } from '@ant-design/pro-components';
import { Image, Space, Typography } from 'antd';
import { useConcent } from 'concent';
import { FC, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CryptoCurrency: FC = () => {
	const {
		state: { state }
	} = useConcent('$$global');
	const { currency, symbol } = state;
	const actionRef = useRef<ActionType>();
	const columns: ProColumnType<CoinData>[] = [
		{
			title: '#',
			align: 'right',
			render: (_, _1, index) => index + 1
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				const { id } = record;
				return (
					<Space>
						<Image
							preview={false}
							src={record.image}
							alt={record.name}
							height={20}
							width={20}
							onClick={() => {
								navigate('/coin');
								setLocalStorage('coin', id);
							}}
						/>
						<Typography.Link
							onClick={() => {
								navigate('/coin');
								setLocalStorage('coin', id);
							}}
						>
							{record.name}
						</Typography.Link>
					</Space>
				);
			}
		},
		{
			title: 'Price',
			align: 'right',
			render: (_, record) => (
				<span>
					{symbol}
					{formatNumber(record.current_price, '0,0.00')}
				</span>
			)
		},
		{
			title: '24%',
			align: 'center',
			render: (_, record) => {
				const { price_change_percentage_24h: per } = record;

				return (
					<span
						style={{
							color: record.price_change_percentage_24h > 0.0 ? '#16c784' : '#ea3943'
						}}
					>
						{+per.toFixed(2) > 0.0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
						{record.price_change_percentage_24h.toFixed(2).replace('-', '')}
					</span>
				);
			}
		},
		{
			title: 'Market Cap',
			align: 'center',
			render: (_, record) => `${symbol} ${formatNumber(record.market_cap)}`
		},
		{
			title: 'Volume',
			align: 'center',
			render: (_, record) => `${symbol} ${formatNumber(record.total_volume)}`
		},
		{
			title: 'Circulating Supply',
			align: 'center',
			render: (_, record) => `${symbol} ${formatNumber(record.circulating_supply)}`
		}
	];

	const navigate = useNavigate();

	const getAllData = async params => {
		const data = await getAllCoins({
			vs_currency: currency,
			price_change_percentage: '1h,24h,7d'
		});

		return {
			data: data.data,
			total: Number(data.data.length)
		};
	};

	return (
		<ProTable<CoinData>
			{...PRO_TABLE_PROPS}
			rowKey="id"
			search={false}
			columns={columns}
			request={getAllData}
			actionRef={actionRef}
		/>
	);
};

export default CryptoCurrency;
