import { getLocalStorage } from '@/utils/xLocalstorage';
import { useConcent } from 'concent';
import { FC } from 'react';

const Coin: FC = () => {
	const coin = getLocalStorage('coin');
	return <div>{coin}</div>;
};

export default Coin;
