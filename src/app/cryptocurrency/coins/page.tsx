'use client'

import React, { FC, useEffect, useRef } from 'react'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Space, Tooltip, Typography } from 'antd'
import Image from 'next/image'
import { getCryptocurrency, Cryptocurrency } from '@/api'
import { useAppSelector } from '@/redux/store'
import { numberWithCommas } from '@/utils'
import { renderPercentage } from '@/utils/antd'
import { PRO_TABLE_PROPS, formatPrice } from '@/constants'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const Coins: FC = () => {
	const actionRef = useRef<ActionType>()
	const navigate = useRouter()
	const { symbol, sign } = useAppSelector(state => state.setCurrency.value)
	const columns: ProColumns<Cryptocurrency>[] = [
		{
			title: '#',
			align: 'center',
			render: (_, { cmc_rank }) => cmc_rank
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				const src = `https://s2.coinmarketcap.com/static/img/coins/64x64/${record.id}.png`

				return (
					<Space align="center">
						<Image src={src} alt={`logo${record.slug}`} width={25} height={25} />
						<Typography.Link onClick={() => navigate.replace(`/cryptocurrency/${record.slug}`)}>
							{record.name}
						</Typography.Link>
					</Space>
				)
			}
		},
		{
			title: 'Price',
			align: 'right',
			render: (_, { quote }) => <div>{formatPrice(sign, quote[symbol]?.price)}</div>
		},
		{
			title: '1h %',
			align: 'center',
			render: (_, { quote }) => renderPercentage(quote[symbol]?.percent_change_1h)
		},
		{
			title: '24 %',
			align: 'center',
			render: (_, { quote }) => renderPercentage(quote[symbol]?.percent_change_24h)
		},
		{
			title: '7d %',
			align: 'center',
			render: (_, { quote }) => renderPercentage(quote[symbol]?.percent_change_7d)
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
								<Typography.Link>Read More</Typography.Link>
							</span>
						}
					>
						<InfoCircleOutlined />
					</Tooltip>
				</span>
			),

			align: 'right',
			render: (_, { quote }) => <div>{formatPrice(sign, quote[symbol]?.market_cap)}</div>
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
								<Typography.Link>Read More</Typography.Link>
							</span>
						}
					>
						<InfoCircleOutlined />
					</Tooltip>
				</span>
			),
			align: 'right',
			render: (_, { quote }) => (
				<div>
					<div>{formatPrice(sign, quote[symbol]?.volume_24h)}</div>
				</div>
			)
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
								<Typography.Link>Read More</Typography.Link>
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

	const getTableData = async () => {
		const data = await getCryptocurrency({
			aux: 'cmc_rank,circulating_supply',
			limit: 5000,
			convert: symbol,
			cryptocurrency_type: 'coins'
		})

		const result = data.data?.map(crypto => ({
			...crypto
		}))

		return {
			data: result
		}
	}

	// const getTableData = async () => {
	// 	const [data, coins] = await Promise.all([
	// 		getCryptocurrency({
	// 			aux: 'cmc_rank,circulating_supply',
	// 			limit: 5000,
	// 			convert: symbol,
	// 			cryptocurrency_type: 'coins'
	// 		}),
	// 		getCoinList()
	// 	])

	// 	const coinsMap = new Map(coins.map(obj => [obj.symbol.toLowerCase(), obj.id]))
	// 	const result = data.data?.map(crypto => ({
	// 		...crypto,
	// 		slug: coinsMap.get(crypto.symbol.toLowerCase())
	// 	}))

	// 	return {
	// 		data: result
	// 	}
	// }

	useEffect(() => {
		if (actionRef.current) {
			actionRef.current?.reload()
		}
	}, [symbol])

	return (
		<ProTable<Cryptocurrency>
			{...PRO_TABLE_PROPS}
			actionRef={actionRef}
			rowKey="id"
			columns={columns}
			search={false}
			request={getTableData}
		/>
	)
}

export default Coins
