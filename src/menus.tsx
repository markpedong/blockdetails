import Cryptocurrency from '@/app/cryptocurrency/page'
import Exchanges from '@/app/exchanges/page'
import { AreaChartOutlined, GlobalOutlined } from '@ant-design/icons'
import React from 'react'

export default [
	{
		path: '/cryptocurrency',
		name: 'Cryptocurrency',
		icon: <GlobalOutlined />,
		children: [
			{
				path: '/cryptocurrency/coins',
				name: 'Coins',
				element: <Cryptocurrency />
			}
		]
	},
	{
		path: '/exchanges',
		name: 'Exchanges',
		icon: <AreaChartOutlined />,
		children: [
			{
				path: '/exchanges/spot',
				name: 'Spot',
				element: <Exchanges />
			}
		]
	}
]
