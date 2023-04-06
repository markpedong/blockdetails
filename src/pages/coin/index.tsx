import { CoinData } from '@/api';
import Title from '@/pages/coin/title';
import { getLocalStorage } from '@/utils/xLocalstorage';
import { Col, Row } from 'antd';
import { useConcent } from 'concent';
import { FC } from 'react';

const Coin: FC = () => {
	const coin = getLocalStorage('coin') as unknown as CoinData;
	console.log(coin);
	return (
		<div>
			<Row>
				<Col>
					<Title />
				</Col>
			</Row>
		</div>
	);
};

export default Coin;
