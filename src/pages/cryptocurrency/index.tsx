import { FC } from 'react';
import { getLocalStorage } from '../../utils/xLocalstorage';

const CryptoCurrency: FC = () => {
	const coin = getLocalStorage('coin');

	console.log(coin);

	return <div>cryptocurrency</div>;
};

export default CryptoCurrency;
