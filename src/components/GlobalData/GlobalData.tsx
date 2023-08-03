'use client'

import { getFiats, getGlobalCrypto } from '@/api'
import { setCurrency } from '@/redux/features/currencySlice'
import { darkMode } from '@/redux/features/themeSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { numberWithCommas, numberWithSuffix } from '@/utils'
import { renderPercentage } from '@/utils/antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Row, Select, Space, Switch, Typography } from 'antd'
import dynamic from 'next/dynamic'
import { use } from 'react'
import { useDispatch } from 'react-redux'

const { Link } = Typography

// prevents infinite loop
const globalData = getGlobalCrypto()
const fiatsData = getFiats()

const GlobalData = () => {
	const { data: global } = use(globalData)
	const { data: fiats } = use(fiatsData)
	const { symbol, sign } = useAppSelector(state => state.setCurrency.value)
	const dispatch = useDispatch<AppDispatch>()
	const darkTheme = useAppSelector(state => state.themeReducer.value.isDark)

	console.log(global)

	const renderPer = (per: number) => (
		<span style={{ color: per > 0.01 ? '#16c784' : '#ea3943' }}>
			{per > 0.01 ? <CaretUpOutlined /> : <CaretDownOutlined />}
			{per?.toFixed(2).replace('-', '')}%
		</span>
	)

	const data = {
		active: global?.active_cryptocurrencies,
		exchanges: global?.active_exchanges,
		mcap: numberWithSuffix(global?.quote[symbol]?.total_market_cap),
		mcap_per: renderPer(global?.quote[symbol]?.total_market_cap_yesterday_percentage_change),
		volume: numberWithSuffix(global?.quote[symbol]?.total_volume_24h),
		volume_per: renderPer(global?.quote[symbol]?.total_volume_24h_yesterday_percentage_change),
		btc: global?.btc_dominance?.toFixed(2).replace('-', ''),
		eth: global?.eth_dominance?.toFixed(2).replace('-', '')
	}

	return (
		<Row style={{ display: 'flex', justifyContent: 'space-between' }}>
			<Space style={{ fontSize: '0.7rem' }}>
				Cryptos: <Link style={{ fontSize: '0.7rem' }}>{data.active}</Link>
				Exchanges: <Link style={{ fontSize: '0.7rem' }}>{data.exchanges}</Link>
				Market Cap:
				<Link style={{ fontSize: '0.7rem' }}>
					{sign}
					{data.mcap} {data.mcap_per}
				</Link>
				24h Vol:
				<Link style={{ fontSize: '0.7rem' }}>
					{sign}
					{data.volume} {data.volume_per}
				</Link>
				Dominance:
				<Link style={{ fontSize: '0.7rem' }}>
					BTC: {data.btc}% ETH: {data.eth}%
				</Link>
			</Space>
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
		</Row>
	)
}

export default dynamic(() => Promise.resolve(GlobalData))
