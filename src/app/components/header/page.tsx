'use client'

import { darkMode } from '@/redux/features/themeSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { formatPrice } from '@/utils'
import { renderPer } from '@/utils/antd'
import { Row, Select, Space, Switch, Typography } from 'antd'
import React, { FC } from 'react'
import { useDispatch } from 'react-redux'

const { Link } = Typography

const Header: FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const darkTheme = useAppSelector(state => state.themeReducer.value.isDark)
	const { sign, symbol } = useAppSelector(state => state.setCurrency.value)

	const data = {
		active: global?.active_cryptocurrencies,
		exchanges: global?.active_exchanges,
		mcap: formatPrice(global?.quote?.[symbol]?.total_market_cap),
		mcap_per: global?.quote?.[symbol]?.total_market_cap_yesterday_percentage_change,
		volume: formatPrice(global?.quote?.[symbol]?.total_volume_24h),
		volume_per: global?.quote?.[symbol]?.total_volume_24h_yesterday_percentage_change,
		btc: global?.btc_dominance?.toFixed(2).replace('-', ''),
		btc_per: global?.btc_dominance_24h_percentage_change,
		eth: global?.eth_dominance?.toFixed(2).replace('-', ''),
		eth_per: global?.eth_dominance_24h_percentage_change
	}
	// DISPATCH ON THE COIN COMPONENT
	return (
		<Row style={{ display: 'flex', justifyContent: 'space-between' }}>
			<Space style={{ fontSize: '0.7rem' }}>
				Cryptos:<Link style={{ fontSize: '0.7rem' }}>{data.active}</Link>
				Exchanges:<Link style={{ fontSize: '0.7rem' }}>{data.exchanges}</Link>
				Market Cap:
				<Link style={{ fontSize: '0.7rem' }}>
					{sign}
					{data.mcap} {renderPer(data.mcap_per)}
				</Link>
				24h Vol:
				<Link style={{ fontSize: '0.7rem' }}>
					{sign}``
					{data.volume} {renderPer(data.volume_per)}
				</Link>
				Dominance:
				<Link style={{ fontSize: '0.7rem' }}>
					BTC:{data.btc}% {renderPer(data.btc_per)} ETH:{data.eth}% {renderPer(data.eth_per)}
				</Link>
			</Space>
			<Space>
				<Switch
					onChange={() => dispatch(darkMode(!darkTheme))}
					checkedChildren="Dark"
					unCheckedChildren="Light"
				/>
				<Select
					showSearch
					placeholder="USD, PHP, CNY"
					// options={fiats?.map(item => ({ label: `${item.sign} ${item.name}`, value: item.id }))}
					filterOption={(input, option) =>
						String(option?.label ?? '')
							.toLowerCase()
							.includes(input.toLowerCase())
					}
					onChange={val => {
						// const selected = fiats.find(fiat => fiat.id === val)
						// dispatch(setCurrency(selected))
					}}
					style={{ width: 150 }}
				/>
			</Space>
		</Row>
	)
}

export default Header
