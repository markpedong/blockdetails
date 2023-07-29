'use client'

import { darkMode } from '@/redux/features/themeSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { Col, Row, Switch } from 'antd'
import dynamic from 'next/dynamic'
import { use } from 'react'
import { useDispatch } from 'react-redux'

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
	const dispatch = useDispatch<AppDispatch>()
	const theme1 = useAppSelector(state => state.themeReducer.value.isDark)

	return (
		<Row justify='space-between'>
			<Col>Cryptos: {data?.active_cryptocurrencies}</Col>
			<Col>
				<Switch
					onChange={() => {
						dispatch(darkMode(!theme1))
					}}
				/>
				{/* <Switch onChange={() => setDarkMode(!darkMode)} /> */}
			</Col>
		</Row>
	)
}

export default dynamic(() => Promise.resolve(GlobalData))
