import { CoinData, getAllCoins } from '@/api';
import { PRO_TABLE_PROPS } from '@/constants';
import { formatNumber } from '@/utils';
import { setLocalStorage } from '@/utils/xLocalstorage';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { ProColumnType, ProTable } from '@ant-design/pro-components';
import { Image, Space, Typography } from 'antd';
import { useConcent } from 'concent';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const CryptoCurrency: FC = () => {
	const {
		state: { state }
	} = useConcent('$$global');
	const { currency, symbol } = state;
	const navigate = useNavigate();
	const columns: ProColumnType<CoinData>[] = [
		{
			title: '#',
			align: 'right',
			render: (_, _1, index) => index + 1
		},
		{
			title: 'Name',
			align: 'left',
			dataIndex: 'name',
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
			dataIndex: 'current_price',
			render: (_, record) => {
				return (
					<span>
						{symbol}
						{formatNumber(record.current_price, '0,0.00')}
					</span>
				);
			}
		},
		{
			title: '24%',
			align: 'center',
			dataIndex: 'price_change_percentage_24h',
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
			render: (_, record) => {
				return (
					<span>
						{symbol}
						{formatNumber(record.market_cap)}
					</span>
				);
			}
		},
		{
			title: 'Volume',
			align: 'center',
			render: (_, record) => {
				return (
					<span>
						{symbol}
						{formatNumber(record.total_volume)}
					</span>
				);
			}
		},
		{
			title: 'Circulating Supply',
			align: 'center',
			render: (_, record) => {
				return <span>{formatNumber(record.circulating_supply)}</span>;
			}
		}
	];

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

	return <ProTable {...PRO_TABLE_PROPS} search={false} rowKey="id" columns={columns} request={getAllData} />;
};

export default CryptoCurrency;
