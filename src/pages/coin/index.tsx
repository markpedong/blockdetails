import { CoinData, getCoinData } from '@/api';
import { formatNumber } from '@/utils';
import { renderPercentage } from '@/utils/antd';
import { getLocalStorage } from '@/utils/xLocalstorage';
import { CaretDownOutlined, CaretUpOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Image, Row, Space, Typography } from 'antd';
import { useConcent } from 'concent';
import { FC, useEffect } from 'react';

const Coin: FC = () => {
	const coin = getLocalStorage('coin') as unknown as CoinData;
	const {
		state: { state }
	} = useConcent('$$global');
	const { symbol } = state;
	const price_per_bg = coin.price_change_percentage_24h_in_currency > 0.0 ? '#16c784' : '#ea3943';

	useEffect(() => {
		const fetchData = async () => {
			const data = await getCoinData({
				localization: false,
				tickers: false,
				market_data: true,
				community_data: true,
				developer_data: true,
				sparkline: false
			});

			console.log(data.data);
		};
		fetchData();
	}, []);

	return (
		<div>
			<Row>
				<Col span={8}>
					<div>
						<Space direction="horizontal" align="center">
							<Typography.Text strong>Cryptocurrencies</Typography.Text> <RightOutlined />
							<Typography.Text strong>Coins</Typography.Text> <RightOutlined />
							<Typography.Text strong>{coin.name}</Typography.Text>
						</Space>
					</div>
					<br />
					<div>
						<Space direction="horizontal" align="center">
							<Image src={coin.image} preview={false} height={40} width={40} />
							<Typography.Title style={{ margin: 0 }}>{coin.name}</Typography.Title>
							<Typography.Text
								style={{
									textTransform: 'uppercase',
									background: '#a6b0c3',
									padding: '0.5rem 0.8rem',
									borderRadius: '0.6rem'
								}}
								strong
							>
								{coin.symbol}
							</Typography.Text>
						</Space>
					</div>
					<br />
					<Space>
						<Typography.Text>Rank: #{coin.market_cap_rank}</Typography.Text>
						<Typography.Text>{}</Typography.Text>
					</Space>
				</Col>
				<Col span={8} style={{ paddingTop: '1.5rem' }}>
					<div>
						{coin.name} ({coin.symbol.toUpperCase()})
					</div>
					<Space align="center">
						<Typography.Title style={{ margin: 0 }}>
							{symbol}
							{formatNumber(coin.current_price)}
						</Typography.Title>
						<div style={{ background: price_per_bg, borderRadius: '0.5rem', padding: '0.2rem 0.5rem' }}>
							<Typography.Text
								style={{
									margin: 0,
									color: 'white'
								}}
							>
								{coin.price_change_percentage_24h_in_currency > 0.0 ? (
									<CaretUpOutlined />
								) : coin.price_change_percentage_24h_in_currency < 0.0 ? (
									<CaretDownOutlined />
								) : (
									!coin.price_change_percentage_24h_in_currency && ''
								)}
								{coin.price_change_percentage_24h_in_currency.toFixed(2).replace('-', '')}
							</Typography.Text>
						</div>
					</Space>
				</Col>
				<Col span={8}></Col>
			</Row>
		</div>
	);
};

export default Coin;
