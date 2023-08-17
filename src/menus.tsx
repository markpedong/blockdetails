import Cryptocurrency from '@/app/cryptocurrency/page'
import Exchanges from '@/app/exchanges/page'
import { AreaChartOutlined, GlobalOutlined } from '@ant-design/icons'
import React from 'react'
import Tokens from '@/app/cryptocurrency/tokens/page'
import Derivatives from '@/app/exchanges/derivatives/page'
import DEX from '@/app/exchanges/dex/page'

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
			},
			{
				path: '/cryptocurrency/tokens',
				name: 'Tokens',
				element: <Tokens />
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
			},
			{
				path: '/exchanges/derivatives',
				name: 'Derivatives',
				element: <Derivatives />
			},
			{
				path: '/exchanges/dex',
				name: 'DEX',
				element: <DEX />
			}
		]
	}
]
