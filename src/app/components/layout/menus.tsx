import Coins from '@/app/cryptocurrency/coins/page'
import Tokens from '@/app/cryptocurrency/tokens/page'
import { GlobalOutlined } from '@ant-design/icons'

export default [
	{
		path: '/cryptocurrency',
		name: 'Cryptocurrency',
		icon: <GlobalOutlined />,
		children: [
			{
				path: '/cryptocurrency/coins',
				name: 'Coins',
				element: <Coins />
			},
			{
				path: '/cryptocurrency/tokens',
				name: 'Tokens',
				element: <Tokens />
			}
		]
	}
]
