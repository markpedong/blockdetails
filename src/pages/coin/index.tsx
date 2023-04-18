import { CoinData } from '@/api';
import { formatNumber } from '@/utils';
import { renderPercentage } from '@/utils/antd';
import { getLocalStorage } from '@/utils/xLocalstorage';
import { RightOutlined } from '@ant-design/icons';
import { Col, Image, Row, Space, Typography } from 'antd';
import { useConcent } from 'concent';
import { FC } from 'react';

const Coin: FC = () => {
	const coin = getLocalStorage('coin') as unknown as CoinData;
	const {
		state: { state }
	} = useConcent('$$global');
	const { symbol } = state;
	console.log(state);
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
				</Col>
				<Col span={8}>
					{symbol}
					{formatNumber(coin.current_price)}
					{renderPercentage(coin.price_change_percentage_24h_in_currency)}
				</Col>
				<Col span={8}></Col>
			</Row>
		</div>
	);
};

export default Coin;
