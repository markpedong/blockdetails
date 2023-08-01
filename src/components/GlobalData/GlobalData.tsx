'use client'

import { darkMode } from '@/redux/features/themeSlice'
import { getTotalCrypto } from '@/redux/features/globalSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { Col, Row, Switch } from 'antd'
import dynamic from 'next/dynamic'
import { use, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getGlobalCrypto } from '@/api'

// prevents infinite loop
const globalData = getGlobalCrypto()

const GlobalData = () => {
	const { data } = use(globalData)
	const dispatch = useDispatch<AppDispatch>()
	const darkTheme = useAppSelector(state => state.themeReducer.value.isDark)

	useEffect(() => {
		dispatch(getTotalCrypto(data?.active_cryptocurrencies))
	}, [])

	return (
		<Row justify='space-between'>
			<Col>Cryptos: {data?.active_cryptocurrencies}</Col>
			<Col>
				<Switch
					onChange={() => {
						dispatch(darkMode(!darkTheme))
					}}
				/>
				{/* <Switch onChange={() => setDarkMode(!darkMode)} /> */}
			</Col>
		</Row>
	)
}

export default dynamic(() => Promise.resolve(GlobalData))
