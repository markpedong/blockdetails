import Cryptocurrency from '@/app/cryptocurrency/page'
import Exchanges from '@/app/exchanges/page'
import { AreaChartOutlined, ClusterOutlined, GlobalOutlined } from '@ant-design/icons'

export default [
	{
		path: '/cryptocurrency',
		name: 'Cryptocurrency',
		element: <Cryptocurrency />,
		icon: <GlobalOutlined />
	},
	{
		path: '/exchanges',
		name: 'Exchanges',
		icon: <AreaChartOutlined />,
		children: [
			{
				path: '/exchanges/spot',
				name: 'Spot',
				element: <Exchanges />,
				icon: <ClusterOutlined />
			}
		]
	}
]
