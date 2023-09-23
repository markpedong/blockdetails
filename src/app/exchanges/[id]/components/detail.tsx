'use client'

import React, { FC } from 'react'
import { Col, Row, Typography } from 'antd'
import Image from 'next/image'
import { Cryptocurrency, ExchangeDetail, ExchangePap } from '@/api'
import { useAppSelector } from '@/redux/store'
import { formatPrice } from '@/utils'

type Props = {
	exchange: ExchangeDetail
	id: string
	pap: ExchangePap
}

const Detail: FC<Props> = ({ exchange, id, pap }) => {
	const { symbol } = useAppSelector(state => state.global.currency) ?? {}
	const coins = useAppSelector(state => state.coin.coins)
	const { quote } = (coins?.[0] as unknown as Cryptocurrency) ?? {}
	// quote?.[symbol]?.price
	console.log(exchange)
	console.log(pap)
	return (
		<Row>
			<Col span={8}>
				<div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
					<Image src={exchange.image} alt={`${id}`} width={30} height={30} />
					<Typography.Text style={{ fontSize: '2rem', fontWeight: 700 }}>{exchange.name}</Typography.Text>
				</div>
			</Col>
			<Col span={16}>
				<div>
					<Typography.Text style={{ fontSize: '2rem', fontWeight: 700 }}>Volume(24h)</Typography.Text>
				</div>
				<div>
					<Typography.Title level={2}>
						{formatPrice(quote[symbol]?.price * exchange.trade_volume_24h_btc_normalized)}
					</Typography.Title>
					<Typography.Text>{exchange.trade_volume_24h_btc_normalized?.toFixed(2)} BTC</Typography.Text>
				</div>
				<div>{pap.description}</div>
			</Col>
		</Row>
	)
}

export default Detail
