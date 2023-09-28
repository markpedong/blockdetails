'use client'

import { Cryptocurrency, ExchangeDetail, ExchangePap } from '@/api'
import { useAppSelector } from '@/redux/store'
import { formatPrice } from '@/utils'
import { Col, Progress, Row, Space, Typography } from 'antd'
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

const Detail: FC<Props> = ({ exchange, id, pap }) => {
	const { sign, symbol } = useAppSelector(state => state.global.currency)
	const coins = useAppSelector(state => state.coin.coins)
	const router = useRouter()
	const { quote } = coins[0] as unknown as Cryptocurrency
	const filtered = exchange.tickers?.filter(exchange => exchange.target === 'USDT')

	const columns: ProColumns[] = [
		{
			title: '#',
			align: 'center',
			render: (_, _1, i) => i + 1
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				// const src = `https://assets.coingecko.com/markets/images/52/small/${record.coin_id}.jpg`
				return (
					<Space align="center">
						{/* <Image src={src} alt={`logo${record.id}`} width={25} height={25} /> */}
						<Typography.Link onClick={() => router.push(`/exchanges/${record.id}`)}>
							{record.coin_id}
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
			title: 'Volume (24h)',
			align: 'center',
			render: (_, record) => formatPrice(quote[symbol]?.price * record.trade_volume_24h_btc, '$')
		},
		{
			title: 'Trust Score',
			align: 'center',
			render: (_, record) => (
				<div>
					<Progress percent={record.trust_score * 10} showInfo={false} size={[30, 15]} />
					{record.trust_score}
				</div>
			)
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
				<ProTable {...PRO_TABLE_PROPS} rowKey="id" columns={columns} search={false} dataSource={filtered} />
			</Col>
		</Row>
	)
}

export default Detail
