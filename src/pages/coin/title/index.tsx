import { CoinData } from '@/api';
import { getLocalStorage } from '@/utils/xLocalstorage';
import { RightOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';

type Props = {};

const Title = (props: Props) => {
	const coin = getLocalStorage('coin') as unknown as CoinData;

	return (
		<Space>
			<div>
				<Typography.Text strong>Cryptocurrencies</Typography.Text> <RightOutlined />
				<Typography.Text strong>Coins</Typography.Text> <RightOutlined />
				<Typography.Text strong>{coin.name}</Typography.Text>
			</div>
		</Space>
	);
};

export default Title;
