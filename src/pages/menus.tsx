import CryptoCurrency from '@/pages/cryptocurrency';
import Exchanges from '@/pages/exchanges';

export default [
	{
		path: '/cryptocurrency',
		name: 'Cryptocurrency',
		element: <CryptoCurrency />
	},
	{
		path: '/exchanges',
		name: 'Exchanges',
		element: <Exchanges />
	}
];
