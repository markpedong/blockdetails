'use client'

import { CoinData, QuoteData, getDetail, getQuotesLatest } from '@/api'
import { formatPrice } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { Col, Row, Space, Spin, Typography } from 'antd'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

const Detail: FC = ({ params }: { params: any }) => {
	const [coin, setCoin] = useState<CoinData>()
	const [quotes, setQuotes] = useState<QuoteData>()
	const { symbol, sign } = useAppSelector(state => state.setCurrency.value)

	const initData = async () => {
		const [data, quoteData] = await Promise.all([
			getDetail({
				slug: params.slug
			}),
			getQuotesLatest({
				slug: params.slug
			})
		])

		setCoin(Object.values(data.data)[0] as CoinData)
		setQuotes(Object.values(quoteData.data)[0] as unknown as any)

		console.log(data)
	}

	useEffect(() => {
		initData()
	}, [params.slug])

	return (
		<div>
			{coin?.name ? (
				<Row>
					<Col span={6}>
						<Space direction="horizontal">
							<Space direction="horizontal">
								<Image src={coin?.logo} alt={`${coin?.name}`} width={30} height={30} />
								<Typography.Title level={2}>{coin?.name}</Typography.Title>
							</Space>
							<Typography.Text type="secondary">{coin?.symbol}</Typography.Text>
						</Space>
					</Col>
					<Col span={12}>
						<Space>
							<Typography.Title>{formatPrice(sign, quotes.quote[symbol]?.price)}</Typography.Title>
						</Space>
					</Col>
					<Col span={6}>1</Col>
				</Row>
			) : (
				<Spin size="large" />
			)}
		</div>
	)
}

export default Detail
