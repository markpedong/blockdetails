import CryptoCurrency from '@/pages/cryptocurrency';
import Exchanges from '@/pages/exchanges';
import { AreaChartOutlined, SlidersOutlined } from '@ant-design/icons';

export default [
	{
		path: '/cryptocurrency',
		name: 'Cryptocurrency',
		element: <CryptoCurrency />,
		icon: <SlidersOutlined />
	},
	{
		path: '/exchanges',
		name: 'Exchanges',
		element: <Exchanges />,
		icon: <AreaChartOutlined />
	}
];
