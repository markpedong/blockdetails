'use client'

import { CGCoinData, ExchangeDetail, ExchangePap } from '@/api'
import { useAppSelector } from '@/redux/store'
import { formatPrice } from '@/utils'
import { Col, Row, Typography } from 'antd'
import Image from 'next/image'
import { FC } from 'react'
import Links from './links'
import MarketData from './market-data'
import MarketTable from './market-table'

type Props = {
	exchange: ExchangeDetail
	id: string
	pap: ExchangePap
	cg: CGCoinData[]
}

const Detail: FC<Props> = ({ exchange, id, pap, cg }) => {
	const { sign, symbol } = useAppSelector(state => state.global.currency)

	return (
		<Row>
			<Col span={8}>
				<div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
					<Image src={exchange.image} alt={`${id}`} width={30} height={30} />
					<Typography.Text style={{ fontSize: '2rem', fontWeight: 700 }}>{exchange.name}</Typography.Text>
				</div>
				<Links exchange={exchange} pap={pap} />
				<MarketData exchange={exchange} pap={pap} />
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
			<MarketTable cg={cg} exchange={exchange} />
		</Row>
	)
}

export default Detail
