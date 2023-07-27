'use client'

import { Space } from 'antd'
import dynamic from 'next/dynamic'
import { use } from 'react'

const getGlobalData = async () => {
	const res = await fetch('https://sandbox-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
		headers: {
			'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
		}
	})

	return res.json()
}

// prevents infinite loop
const globalData = getGlobalData()

const GlobalData = () => {
	const { data } = use(globalData)

	return (
		<Space>
			<div>Cryptos: {data?.active_cryptocurrencies}</div>
		</Space>
	)
}

export default dynamic(() => Promise.resolve(GlobalData))
