'use client'

import React, { FC, useEffect } from 'react'
import { Col, Row, Space, Typography } from 'antd'
import Image from 'next/image'
import { ExchangeDetail, ExchangePap, GlobalData } from '@/api'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { formatPrice } from '@/utils'
import { useDispatch } from 'react-redux'
import { setGlobalData } from '@/redux/features/globalSlice'
import { RedditOutlined } from '@ant-design/icons'

type Props = {
	exchange: ExchangeDetail
	id: string
	pap: ExchangePap
	global: GlobalData
}

const Detail: FC<Props> = ({ exchange, id, pap, global }) => {
	const dispatch = useDispatch<AppDispatch>()
	const { symbol, sign } = useAppSelector(state => state.global.currency)
	console.log(exchange)
	console.log('pap', pap)

	useEffect(() => {
		dispatch(setGlobalData(global))
	}, [symbol, sign])

	return (
		<Row>
			<Col span={8}>
				<div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '10px' }}>
					<Image src={exchange.image} alt={`${id}`} width={30} height={30} />
					<Typography.Text style={{ fontSize: '2rem', fontWeight: 700 }}>{exchange.name}</Typography.Text>
				</div>
				<Space>
					<div>
						<RedditOutlined />
						{exchange.reddit_url}
					</div>
				</Space>
			</Col>
			<Col span={16}>
				<div>
					<Typography.Text style={{ fontSize: '1.5rem', fontWeight: 700 }}>Volume(24h)</Typography.Text>
				</div>
				<div>
					<Typography.Title level={2}>
						{formatPrice(pap.quotes['USD']?.adjusted_volume_24h, '$')}
					</Typography.Title>
				</div>
				<div>{pap?.description}</div>
			</Col>
		</Row>
	)
}

export default Detail
