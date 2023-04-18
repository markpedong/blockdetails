import { CoinData, getAllCoins, getGlobalData } from '@/api';
import { PRO_TABLE_PROPS } from '@/constants';
import { formatNumber } from '@/utils';
import { renderPercentage } from '@/utils/antd';
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
	const navigate = useNavigate();
	const { currency, symbol } = state;
	const actionRef = useRef<ActionType>();
	const columns: ProColumnType<CoinData>[] = [
		{
			title: '#',
			align: 'right',
			render: (_, record) => record.market_cap_rank
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				return (
					<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<img
							style={{ blockSize: '20px' }}
							src={record.image}
							onClick={() => {
								navigate(`/cryptocurrency/${record.id}`);
								setLocalStorage('coin', record);
							}}
						/>
						<Typography.Link
							onClick={() => {
								navigate(`/cryptocurrency/${record.id}`);
								setLocalStorage('coin', record);
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
			render: (_, record) => {
				const price = record.current_price;

				console.log(formatNumber(parseFloat(String(price)), '0,0.00'));

				return (
					<>
						<span>{price ? symbol : ''}</span>{' '}
						<span>{!price ? '' : formatNumber(price, formatNumberHandler(price))}</span>
					</>
				);
			}
		},
		{
			title: '1h%',
			align: 'center',
			render: (_, record) => renderPercentage(record.price_change_percentage_1h_in_currency)
		},
		{
			title: '24%',
			align: 'center',
			render: (_, record) => renderPercentage(record.price_change_percentage_24h_in_currency)
		},
		{
			title: '7d%',
			align: 'center',
			render: (_, record) => renderPercentage(record.price_change_percentage_7d_in_currency)
		},
		{
			title: 'Market Cap',
			align: 'center',
			render: (_, record) => {
				const price = record.market_cap;

				return (
					<>
						<span>{price ? symbol : ''}</span>
						<span>{price ? formatNumber(price, '0,0.00') : ''}</span>
					</>
				);
			}
		},
		{
			title: 'Volume',
			align: 'center',
			render: (_, record) => {
				const price = record.total_volume;

				return (
					<>
						<span>{price ? symbol : ''}</span>
						<span>{price ? formatNumber(price, '0,0.00') : ''}</span>
					</>
				);
			}
		},
		{
			title: 'Circulating Supply',
			align: 'center',
			render: (_, record) => {
				const price = record.circulating_supply;

				return price ? formatNumber(price, '0,0.00') : '';
			}
		}
	];

	const formatNumberHandler = (number: number) => {
		switch (true) {
			case number < 0.0000000001:
				return '0,0.00000000000000';
			case number < 0.00000001:
				return '0,0.0000000000000';
			case number < 0.0000001:
				return '0,0.000000000000';
			case number < 0.000001:
				return '0,0.0000000000';
			case number < 0.00001:
				return '0,0.000000000';
			case number < 0.0001:
				return '0,0.00000000';
			case number < 0.001:
				return '0,0.0000000';
			case number < 0.01:
				return '0,0.000000';
			case number < 0.1:
				return '0,0.00000';
			case number < 1:
				return '0,0.00';
			case number >= 1:
				return '0,0.00';
			default:
				return number.toString();
		}
	};

	const getAllData = async params => {
		const data = await getAllCoins({
			vs_currency: currency,
			per_page: params.pageSize,
			page: params.current,
			price_change_percentage: '1h,24h,7d'
		});
		const global = await getGlobalData();
		const total = global.data.data.active_cryptocurrencies;

		return {
			data: data.data,
			total: Number(total) ?? 0
		};
	};

	return (
		<ProTable<CoinData>
			{...PRO_TABLE_PROPS}
			rowKey="id"
			search={false}
			columns={columns}
			// @ts-ignore
			request={getAllData}
			actionRef={actionRef}
		/>
	);
};

export default CryptoCurrency;
