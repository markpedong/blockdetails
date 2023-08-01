'use client'

import { getFiats, getGlobalCrypto } from '@/api'
import { setCurrency } from '@/redux/features/currencySlice'
import { getTotalCrypto } from '@/redux/features/globalSlice'
import { darkMode } from '@/redux/features/themeSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { Col, Row, Select, Switch } from 'antd'
import dynamic from 'next/dynamic'
import { use, useEffect } from 'react'
import { useDispatch } from 'react-redux'

// prevents infinite loop
const globalData = getGlobalCrypto()
const fiatsData = getFiats()

const GlobalData = () => {
	const { data } = use(globalData)
	const { data: fiats } = use(fiatsData)
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
				<Select
					placeholder='Select Currency:'
					options={fiats?.map(item => ({ label: `${item.sign} ${item.name}`, value: item.id }))}
					onChange={val => {
						const selected = fiats.find(fiat => fiat.id === val)

						dispatch(setCurrency(selected))
					}}
				/>
			</Col>
		</Row>
	)
}

export default dynamic(() => Promise.resolve(GlobalData))
