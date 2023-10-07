import { CoinMarketResponse } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { formatPrice, navigate } from '@/utils'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Button, Space, Typography } from 'antd'
import Image from 'next/image'
import React, { FC, useRef } from 'react'
import { ValuesType } from 'utility-types'
import { useSearchParams } from 'next/navigation'

type TableListItem = ValuesType<CoinMarketResponse['tickers']>
type Props = {
	data: TableListItem[]
	id: string
	tab?: string
}

const Markets: FC<Props> = ({ data: markets, tab = 'overview' }) => {
	const actionRef = useRef<ActionType>()
	const coin = useAppSelector(state => state.coin.coin)
	const { sign } = useAppSelector(state => state.global.currency)
	const params = useSearchParams()
	const columns: ProColumns<TableListItem>[] = [
		{
			title: '#',
			align: 'center',
			render: (_, _1, i) => i + 1
		},
		{
			title: 'Exchange',
			align: 'left',
			render: (_, record) => (
				<Space align="center">
					<Image src={record.market.logo} alt={`logo${record.market.name}`} width={25} height={25} />
					<Typography.Link href={navigate(`/exchanges/${record.market.identifier}`, params)}>
						{record.market.name}
					</Typography.Link>
				</Space>
			)
		},
		{
			title: 'Pair',
			align: 'center',
			render: (_, record) => (
				<Typography.Link href={record.trade_url} target="_blank">
					{record.base}/{record.target}
				</Typography.Link>
			)
		},
		{
			title: '+2% Depth',
			align: 'center',
			render: (_, record) => formatPrice(record.cost_to_move_up_usd, sign) ?? 0
		},
		{
			title: '-2% Depth',
			align: 'center',
			render: (_, record) => formatPrice(record.cost_to_move_down_usd, sign) ?? 0
		},
		{
			title: '24h Volume',
			align: 'center',
			render: (_, record) => formatPrice(record.converted_volume.usd, sign) ?? 0
		},
		{
			title: 'Spread',
			align: 'center',
			render: (_, record) => record.bid_ask_spread_percentage?.toFixed(2)
		},
		{
			title: 'Trust Score',
			align: 'center',
			render: (_, record) => (
				<Button
					style={{
						backgroundColor: record.trust_score,
						borderRadius: '2rem',
						blockSize: '1rem'
					}}
				/>
			)
		}
	]

	const reducedMarkets = markets
		?.sort((a, b) => b.converted_volume.usd - a.converted_volume.usd)
		?.filter(item => item.target === 'USDT')
		?.reduce((acc, curr) => {
			const existingMarket = acc.find(entry => entry.market.identifier === curr.market.identifier)

			if (!existingMarket) {
				acc.push(curr)
			} else if (curr.volume > existingMarket.volume) {
				acc[acc.indexOf(existingMarket)] = curr
			}

			return acc
		}, [])

	return (
		<div style={{ marginBlockStart: '2rem' }}>
			<Typography.Title level={3}>{coin.name} Markets</Typography.Title>
			<ProTable<TableListItem>
				{...PRO_TABLE_PROPS}
				dataSource={reducedMarkets}
				actionRef={actionRef}
				rowKey="trade_url"
				columns={columns}
				pagination={{ pageSize: tab === 'markets' ? reducedMarkets?.length : 6, showSizeChanger: false }}
				search={false}
			/>
		</div>
	)
}

export default Markets
