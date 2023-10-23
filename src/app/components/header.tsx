'use client'

import { MODAL_FORM_PROPS, PAP_FIAT } from '@/constants'
import { getCoins, getCoinsID, getExchangeID, getExchangesSlice } from '@/redux/features/coinSlice'
import {
	getAllCurrency,
	getAllFiats,
	getGlobal,
	setCurrency,
	setGlobalData,
	toggleDarkMode,
	toggleTheme
} from '@/redux/features/globalSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { numberWithSuffix } from '@/utils'
import { renderPer } from '@/utils/antd'
import { SearchOutlined } from '@ant-design/icons'
import { ModalForm } from '@ant-design/pro-components'
import { AutoComplete, Col, Flex, Input, Row, Select, Space, Switch, Typography } from 'antd'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'
import { useDispatch } from 'react-redux'

const { Link, Text } = Typography

const Header: FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useRouter()
	const pathname = usePathname()
	const coins = useAppSelector(getCoins)
	const global = useAppSelector(getGlobal)
	const darkMode = useAppSelector(toggleTheme)
	const fiats = useAppSelector(getAllFiats)
	const { symbol } = useAppSelector(getAllCurrency)
	const exchanges = useAppSelector(getExchangesSlice)
	const coinsID = useAppSelector(getCoinsID)
	const exchangeID = useAppSelector(getExchangeID)

	const renderFiatOptions = fiats =>
		fiats.map(item => {
			const exchange = pathname.split('/')[1] === 'exchanges'

			return {
				label: `${item.sign} ${item.name}`,
				value: item.symbol,
				disabled: !PAP_FIAT.includes(item.symbol) && exchange
			}
		})

	const renderCoins = () =>
		coins.slice(0, 9).map(record => {
			const src = `https://s2.coinmarketcap.com/static/img/coins/64x64/${record.id}.png`

			return (
				<Flex style={{ marginBlock: '10px', gap: '10px' }} key={record.id}>
					<Image src={src} alt={`logo${record.slug}`} width={25} height={25} />
					<Space align="center">
						<Link href={`/cryptocurrency/${record.slug}`}>{record.name}</Link>
						<Text type="secondary">{record.symbol}</Text>
					</Space>
				</Flex>
			)
		})

	const renderExchanges = () =>
		exchanges.slice(0, 9).map(i => {
			return (
				<Flex key={i.name} style={{ marginBlock: '10px', gap: '10px' }}>
					<Image src={i.image} alt={`logo${i.image}`} width={25} height={25} />
					<Space align="center">
						<Link href={`/exchanges/${i.id}`}>{i.name}</Link>
						<Text type="secondary">{i.name.split(' ')[0]}</Text>
					</Space>
				</Flex>
			)
		})

	const renderSearch = () => {
		const exchanges = exchangeID.map(i => ({ ...i, type: 'exchange' }))
		const coins = coinsID.map(i => ({ ...i, type: 'coins' }))
		const options = coins.concat(exchanges)
		return (
			<ModalForm
				{...MODAL_FORM_PROPS}
				trigger={
					<Input
						size="middle"
						prefix={<SearchOutlined />}
						style={{ width: 150 }}
						placeholder="eg. Bitcoin, Etherum"
					/>
				}
				submitter={false}
				modalProps={{ closeIcon: false }}
				width={600}
				title="Search for a Cryptocurrency!"
			>
				<AutoComplete
					options={options.map(i => ({
						label: (
							<Link href={`/${i.type === 'coins' ? 'cryptocurrency' : 'exchanges'}/${i.id}`}>
								{i.name}
							</Link>
						),
						value: i.id.toLocaleUpperCase()
					}))}
					placeholder="eg. Ethereum, Avalanche, Binance Smart Chain"
					style={{ width: '100%' }}
					filterOption={(inputValue, option) =>
						option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
					}
				/>
				<Row justify="space-between">
					<Col span={12}>
						<Typography.Title level={5}>Coins:</Typography.Title>
						{renderCoins()}
					</Col>
					<Col span={12}>
						<Typography.Title level={5}>Exchanges:</Typography.Title>
						{renderExchanges()}
					</Col>
				</Row>
			</ModalForm>
		)
	}

	const changeCurrency = async val => {
		const { sign, symbol } = fiats.find(fiat => fiat.symbol === val)

		const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_CMC_PROD}/v1/global-metrics/quotes/latest`, {
			headers: {
				'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_API_KEY_PROD
			}
		})
		const global = await res.json()

		dispatch(setGlobalData(global.data))
		dispatch(setCurrency({ sign, symbol }))

		navigate.push(`${pathname}?currency=${symbol}`)
	}

	return (
		<Flex justify="space-between">
			<Space style={{ fontSize: '0.7rem' }}>
				Cryptos:<Link style={{ fontSize: '0.7rem' }}>{global.active_cryptocurrencies}</Link>
				Exchanges:<Link style={{ fontSize: '0.7rem' }}>{global.active_exchanges}</Link>
				Market Cap:
				<Link style={{ fontSize: '0.7rem' }}>
					{numberWithSuffix(global?.quote[symbol]?.total_market_cap)}{' '}
					{renderPer(global?.quote[symbol]?.total_market_cap_yesterday_percentage_change)}
				</Link>
				24h Vol:
				<Link style={{ fontSize: '0.7rem' }}>
					{numberWithSuffix(global?.quote[symbol]?.total_volume_24h)}{' '}
					{renderPer(global?.quote[symbol]?.total_volume_24h_yesterday_percentage_change)}
				</Link>
				Dominance:
				<Link style={{ fontSize: '0.7rem' }}>
					BTC: {global?.btc_dominance?.toFixed(2)?.replace('-', '')}%
					{renderPer(global?.btc_dominance_24h_percentage_change)} ETH:{' '}
					{global?.eth_dominance?.toFixed(2)?.replace('-', '')}%
					{renderPer(global?.eth_dominance_24h_percentage_change)}
				</Link>
			</Space>
			<Space align="center">
				{renderSearch()}
				<Select
					showSearch
					placeholder="USD, PHP, CNY..."
					options={renderFiatOptions(fiats)}
					filterOption={(input, option) =>
						String(option?.label ?? '')
							.toLowerCase()
							.includes(input.toLowerCase())
					}
					onChange={changeCurrency}
					style={{ width: 150 }}
					value={symbol}
				/>

				<Switch
					onChange={() => {
						dispatch(toggleDarkMode())
					}}
					checked={darkMode}
					checkedChildren="Dark"
					unCheckedChildren="Light"
				/>
			</Space>
		</Flex>
	)
}

export default Header
