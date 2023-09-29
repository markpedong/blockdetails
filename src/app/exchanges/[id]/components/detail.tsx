'use client'

import { Cryptocurrency, ExchangeDetail, ExchangePap } from '@/api'
import { useAppSelector } from '@/redux/store'
import { formatPrice } from '@/utils'
import { Button, Col, Progress, Row, Space, Typography } from 'antd'
import Image from 'next/image'
import { FC } from 'react'
import Links from './links'
import MarketaData from './market-data'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { PRO_TABLE_PROPS } from '@/constants'
import { useRouter } from 'next/navigation'

type Props = {
	exchange: ExchangeDetail
	id: string
	pap: ExchangePap
}

type TableListItem = {
	bid_ask_spread_percentage: number
	coin_id: string
	base: string
	last: number
	trade_url: string
	target: string
	trust_score: string
	volume: number
}

const Detail: FC<Props> = ({ exchange, id, pap }) => {
	const { sign, symbol } = useAppSelector(state => state.global.currency)
	const coins = useAppSelector(state => state.coin.coins)
	const router = useRouter()
	const { quote } = coins[0] as unknown as Cryptocurrency
	const tickers = exchange.tickers?.filter(
		(item, index, self) => index === self.findIndex(t => t.coin_id === item.coin_id)
	)

	console.log(tickers)

	const columns: ProColumns<TableListItem>[] = [
		{
			title: '#',
			align: 'center',
			render: (_, _1, i) => i + 1
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				// const src = `https://assets.coingecko.com/coins/images/6319/large/${record.base.toLowerCase()}.png`

				return (
					<Space align="center">
						{/* <Image src={src} alt={record.coin_id} width={25} height={25} /> */}
						<Typography.Link onClick={() => router.push(`/exchanges/${record.coin_id}`)}>
							{record.coin_id.charAt(0).toUpperCase() + record.coin_id.slice(1)}
						</Typography.Link>
					</Space>
				)
			}
		},
		{
			title: 'Pair',
			align: 'center',
			render: (_, record) => (
				<Typography.Link href={record.trade_url} target="_blank">
					{record.base} / {record.target}
				</Typography.Link>
			)
		},
		{
			title: 'Spread Percentage',
			align: 'center',
			render: (_, record) => record.bid_ask_spread_percentage.toFixed(2)
		},
		{
			title: 'Price',
			align: 'center',
			render: (_, record) => formatPrice(record.last)
		},
		{
			title: 'Volume (24h)',
			align: 'center',
			render: (_, record) => formatPrice(record.volume, '$')
		},
		{
			title: 'Trust Score',
			align: 'center',
			render: (_, record) => <Button style={{ backgroundColor: record.trust_score }} />
		}
	]

	return (
		<Row>
			<Col span={8}>
				<div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
					<Image src={exchange.image} alt={`${id}`} width={30} height={30} />
					<Typography.Text style={{ fontSize: '2rem', fontWeight: 700 }}>{exchange.name}</Typography.Text>
				</div>
				<Links exchange={exchange} pap={pap} />
				<MarketaData exchange={exchange} pap={pap} />
			</Col>
			<Col span={16}>
				<div>
					<Typography.Text style={{ fontSize: '1.5rem', fontWeight: 700 }}>Volume(24h)</Typography.Text>
				</div>
				<div>
					<Typography.Title level={2}>
						{formatPrice(pap.quotes[symbol]?.adjusted_volume_24h, sign)}
					</Typography.Title>
				</div>
				<div>{pap?.description}</div>
			</Col>
			<Col span={24}>
				<Typography.Title level={4}>{exchange.name} Markets:</Typography.Title>
				<ProTable {...PRO_TABLE_PROPS} rowKey="id" columns={columns} search={false} dataSource={tickers} />
			</Col>
		</Row>
	)
}

export default Detail
