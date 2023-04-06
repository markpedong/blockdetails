import { CoinData, getAllCoins, getImageLogo } from '@/api';
import { PRO_TABLE_PROPS } from '@/constants';
import { formatNumber } from '@/utils';
import { setLocalStorage } from '@/utils/xLocalstorage';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { ActionType, ProColumnType, ProTable } from '@ant-design/pro-components';
import { Typography } from 'antd';
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
			render: (_, record) => record.cmc_rank
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				return (
					<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<img
							style={{ blockSize: '20px' }}
							src={getImageLogo(record.id)}
							onClick={() => {
								navigate('/coin');
								setLocalStorage('coin', record.slug);
							}}
						/>
						<Typography.Link
							onClick={() => {
								navigate('/coin');
								setLocalStorage('coin', record.slug);
							}}
						>
							{record.name}
						</Typography.Link>
					</div>
				);
			}
		},
		{
			title: 'Price',
			align: 'right',
			render: (_, record) => `${symbol} ${formatNumber(record.price, '0,0.00')}`
		},
		{
			title: '1h%',
			align: 'center',
			render: (_, record) => renderPercentage(record.percent_change_1h)
		},
		{
			title: '24%',
			align: 'center',
			render: (_, record) => renderPercentage(record.percent_change_24h)
		},
		{
			title: '7d%',
			align: 'center',
			render: (_, record) => renderPercentage(record.percent_change_7d)
		},
		{
			title: 'Market Cap',
			align: 'center',
			render: (_, record) => `${symbol} ${formatNumber(record.market_cap)}`
		},
		{
			title: 'Volume',
			align: 'center',
			render: (_, record) => `${symbol} ${formatNumber(record.volume_24h)}`
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
			convert: currency,
			limit: 5000
		});

		return {
			data:
				data.data.data.map(item => ({
					...item,
					...item.quote[currency]
				})) ?? [],

			total: Number(data.data.data.length) ?? 0
		};
	};

	const renderPercentage = percentage => (
		<span
			style={{
				color: percentage > 0.0 ? '#16c784' : '#ea3943'
			}}
		>
			{percentage?.toFixed(2) > 0.0 ? <CaretUpOutlined /> : <CaretDownOutlined />}{' '}
			{percentage?.toFixed(2).replace('-', '')}
		</span>
	);

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
