'use client'

import { CoinData, QuoteData, getDetail, getQuotesLatest } from '@/api'
import { formatPrice } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { renderPercentage } from '@/utils/antd'
import { Col, Row, Space, Spin, Tag, Typography } from 'antd'
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
	}

	useEffect(() => {
		initData()
	}, [params.slug])

	return (
		<div>
			{coin?.name ? (
				<Row>
					<Col span={9}>
						<Space direction="vertical">
							<div style={{ paddingBlockEnd: '1.2rem', fontWeight: 600, fontSize: '0.8rem' }}>
								Cryptocurrency &gt; {coin.category} &gt; {coin?.name}
							</div>
							<Space direction="horizontal" align="center">
								{/* <div><Image src={coin?.logo} alt={`${coin?.name}`} width={40} height={40} /></div> */}
								<div>
									<Typography.Text style={{ fontSize: '2.3rem', fontWeight: 700 }}>
										{coin?.name}
									</Typography.Text>
								</div>
								<Tag color="#a3b1c9" bordered={false}>
									{coin?.symbol}
								</Tag>
							</Space>
							<Space size={0} direction="horizontal">
								<Tag color="#a3b1c9" bordered={false}>
									Rank #{quotes.cmc_rank}
								</Tag>
								<Tag color="#a3b1c9" bordered={false}>
									{coin.category}
								</Tag>
							</Space>
							<div style={{ paddingBlockStart: '1rem' }}>
								<Tag>Omega</Tag>
							</div>
						</Space>
					</Col>
					<Col span={15}>
						<Space style={{ paddingBlockStart: '2.5rem' }}>
							<div>
								<Typography.Text style={{ fontSize: '2.3rem', fontWeight: 700 }}>
									{formatPrice(sign, quotes?.quote[symbol]?.price)}
								</Typography.Text>
								<Typography.Text></Typography.Text>
							</div>
							<div>{renderPercentage(quotes.quote[symbol].percent_change_24h)}</div>
						</Space>
					</Col>
				</Row>
			) : (
				<Spin size="large" />
			)}
		</div>
	)
}

export default Detail
