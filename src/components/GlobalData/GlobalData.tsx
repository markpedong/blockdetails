'use client'

import { getFiats, getGlobalCrypto } from '@/api'
import { setCurrency } from '@/redux/features/currencySlice'
import { darkMode } from '@/redux/features/themeSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { Typography, Select, Space, Switch } from 'antd'
import dynamic from 'next/dynamic'
import { use } from 'react'
import { useDispatch } from 'react-redux'

// prevents infinite loop
const globalData = getGlobalCrypto()
const fiatsData = getFiats()

const GlobalData = () => {
	const { data: global } = use(globalData)
	const { data: fiats } = use(fiatsData)
	const dispatch = useDispatch<AppDispatch>()
	const darkTheme = useAppSelector(state => state.themeReducer.value.isDark)

	console.log(global)

	return (
		<Space style={{ display: 'flex', justifyContent: 'space-between' }}>
			<div>
				Cryptos: <Typography.Link>{global?.active_cryptocurrencies}</Typography.Link>
			</div>
			<div>
				<Switch
					onChange={() => {
						dispatch(darkMode(!darkTheme))
					}}
				/>
				<Select
					showSearch
					placeholder='Select Currency:'
					options={fiats?.map(item => ({ label: `${item.sign} ${item.name}`, value: item.id }))}
					filterOption={(input, option) =>
						String(option?.label ?? '')
							.toLowerCase()
							.includes(input.toLowerCase())
					}
					onChange={val => {
						const selected = fiats.find(fiat => fiat.id === val)

						dispatch(setCurrency(selected))
					}}
				/>
			</div>
		</Space>
	)
}

export default dynamic(() => Promise.resolve(GlobalData))
