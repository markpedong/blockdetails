'use client'

import { CoinIds, Cryptocurrency, DefiData, Fiat, GlobalData } from '@/_api'
import { PRO_TABLE_PROPS } from '@/_constants'
import { setCoinArray, setGlobalIds } from '@/_redux/features/coinSlice'
import { getFiatsArray, setGlobalData } from '@/_redux/features/globalSlice'
import { AppDispatch, useAppSelector } from '@/_redux/store'
import { formatPrice, navigate, numberWithCommas, numberWithSuffix } from '@/_utils'
import { renderPer } from '@/_utils/antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Space, Tooltip, Typography } from 'antd'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ValuesType } from 'utility-types'

const { Link, Text, Title } = Typography

type Defi = ValuesType<DefiData>

type Props = {
	data: []
	fiats: Fiat[]
	defi: Defi
	initGlobal: GlobalData
	ids: CoinIds[]
}

const Table: FC<Props> = ({ data, defi, fiats, initGlobal, ids }) => {
	const dispatch = useDispatch<AppDispatch>()
	const params = useSearchParams()
	const coins = useAppSelector(state => state.coin.coins)
	const g = useAppSelector(state => state.global.value)
	const { symbol, sign } = useAppSelector(state => state.global.currency)
	const { quote } = (coins?.[0] as unknown as Cryptocurrency) ?? {}
	const columns: ProColumns<Cryptocurrency>[] = [
		{
			title: '#',
			align: 'center',
			render: (_, _1, i) => i + 1
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				const src = `https://s2.coinmarketcap.com/static/img/coins/64x64/${record.id}.png`
				return (
					<Space align="center">
						<Image src={src} alt={`logo${record.slug}`} width={25} height={25} />
						<Link href={navigate(`/cryptocurrency/${record.slug}`, params)}>{record.name}</Link>
					</Space>
				)
			}
		},
		{
			title: 'Price',
			align: 'right',
			render: (_, { quote }) => formatPrice(quote[symbol]?.price, sign)
		},
		{
			title: '1h %',
			align: 'center',
			render: (_, { quote }) => renderPer(quote[symbol]?.percent_change_1h)
		},
		{
			title: '24 %',
			align: 'center',
			render: (_, { quote }) => renderPer(quote[symbol]?.percent_change_24h)
		},
		{
			title: '7d %',
			align: 'center',
			render: (_, { quote }) => renderPer(quote[symbol]?.percent_change_7d)
		},
		{
			title: (
				<span>
					Market Cap{' '}
					<Tooltip
						color="white"
						title={
							<span style={{ color: 'black' }}>
								The total market value of a cryptocurrency&apos;s circulating supply. It is analogous to
								the free-float capitalization in the stock market. Market Cap = Current Price x
								Circulating Supply.
								<Link>Read More</Link>
							</span>
						}
					>
						<InfoCircleOutlined />
					</Tooltip>
				</span>
			),

			align: 'right',
			render: (_, { quote }) => formatPrice(quote[symbol]?.market_cap, sign)
		},
		{
			title: (
				<span>
					Volume(24h){' '}
					<Tooltip
						color="white"
						title={
							<span style={{ color: 'black' }}>
								A measure of how much of a cryptocurrency was traded in the last 24 hours.
								<Link>Read More</Link>
							</span>
						}
					>
						<InfoCircleOutlined />
					</Tooltip>
				</span>
			),
			align: 'right',
			render: (_, { quote }) => formatPrice(quote[symbol]?.volume_24h, sign)
		},
		{
			title: (
				<span>
					Circulating Supply{' '}
					<Tooltip
						color="white"
						title={
							<span style={{ color: 'black' }}>
								The amount of coins that are circulating in the market and are in public hands. It is
								analogous to the flowing shares in the stock market.
								<Link>Read More</Link>
							</span>
						}
					>
						<InfoCircleOutlined />
					</Tooltip>
				</span>
			),
			align: 'right',
			render: (_, { circulating_supply }) => numberWithCommas(circulating_supply)
		}
	]

	useEffect(() => {
		dispatch(setGlobalData(initGlobal))
		dispatch(setCoinArray(data))
		dispatch(getFiatsArray(fiats))
		dispatch(setGlobalIds(ids))
	}, [sign, symbol])

	return (
		<>
			<Space direction="vertical" size={20} style={{ paddingBlockEnd: 50 }}>
				<Title level={3}>Today&apos;s Cryptocurrency Market</Title>
				<div>
					<Text>The Global Crypto Market cap is </Text>
					<Link>
						{sign}
						{numberWithSuffix(g.quote?.[symbol]?.total_market_cap)}
					</Link>
					<Text>
						{renderPer(g.quote?.[symbol]?.total_market_cap_yesterday_percentage_change)}{' '}
						{g.quote?.[symbol]?.total_market_cap_yesterday_percentage_change > 0.01
							? 'increase'
							: 'decrease'}{' '}
						over the last day.
					</Text>
				</div>
				<div>
					<Text>The total crypto market volume over the last 24 hours is </Text>
					<Link>
						{sign}
						{numberWithSuffix(g.quote?.[symbol]?.total_volume_24h)}
					</Link>{' '}
					<Text>. The total volume in DeFi is currently </Text>
					<Link>
						{sign}
						{numberWithSuffix(g.defi_volume_24h_reported)}
					</Link>
					<Text>
						, which is {renderPer(g.defi_24h_percentage_change)} of the total crypto market 24-hour volume.
						DeFi Dominance is {renderPer(+defi.defi_dominance)} , and the Top Coin in DeFi is currently{' '}
						{global?.top_defi} with {renderPer(defi.top_coin_defi_dominance)} of dominance.
					</Text>
				</div>
				<Space direction="vertical" size={0}>
					<Text>Bitcoin&apos;s price is currently {formatPrice(quote?.[symbol]?.price, sign)} </Text>
					<Text>Bitcoin&apos;s dominance is currently {renderPer(g?.btc_dominance)}</Text>
				</Space>
			</Space>
			<ProTable<Cryptocurrency>
				{...PRO_TABLE_PROPS}
				rowKey="id"
				dataSource={data}
				columns={columns}
				search={false}
			/>
		</>
	)
}

export default Table
