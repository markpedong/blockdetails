import { CoinData, getAllCoins } from '@/api';
import { PRO_TABLE_PROPS } from '@/constants';
import { formatNumber } from '@/utils';
import { ActionType, ProColumnType, ProTable } from '@ant-design/pro-components';
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
			render: (_, _1, i) => i + 1
			// fix this must follow the length
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => record.name
			// https://s2.coinmarketcap.com/static/img/coins/64x64/ for images
		},
		{
			title: 'Price',
			align: 'right',
			render: (_, record) => (
				<span>
					{symbol} {formatNumber(record.quote[currency].price, '0,0.00')}
				</span>
			)
		},
		{
			title: '1h%',
			align: 'center'
			// render: (_, record) => {
			// 	const { price_change_percentage_24h: per } = record;

			// 	return (
			// 		<span
			// 			style={{
			// 				color: record.price_change_percentage_24h > 0.0 ? '#16c784' : '#ea3943'
			// 			}}
			// 		>
			// 			{+per.toFixed(2) > 0.0 ? <CaretUpOutlined /> : <CaretDownOutlined />}
			// 			{record.price_change_percentage_24h.toFixed(2).replace('-', '')}
			// 		</span>
			// 	);
			// }
		},
		{
			title: '24%',
			align: 'center'
		},
		{
			title: '7d%',
			align: 'center'
		},
		{
			title: 'Market Cap',
			align: 'center',
			render: (_, record) => `${symbol} ${formatNumber(record.quote[currency].market_cap)}`
		},
		{
			title: 'Volume',
			align: 'center',
			render: (_, record) => `${symbol} ${formatNumber(record.quote[currency].volume_24h)}`
		},
		{
			title: 'Circulating Supply',
			align: 'center',
			render: (_, record) => formatNumber(record.circulating_supply)
		}
	];

	const navigate = useNavigate();

	const getAllData = async params => {
		const data = await getAllCoins({
			start: params.current > 1 ? params.current + 100 : params.current,
			convert: currency
		});

		return {
			data: data.data.data ?? [],
			total: Number(data.data.status.total_count) ?? 0
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
