'use client'

import { CoinData, QuoteData, getDetail, getQuotesLatest } from '@/api'
import { formatPrice } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { extractDomain, numberWithCommas } from '@/utils'
import { renderPercentage } from '@/utils/antd'
import { DownOutlined, ExclamationCircleOutlined, LinkOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Col, Divider, Dropdown, Row, Space, Spin, Tag, Typography } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
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

	console.log(coin)
	console.log(quotes)

	return (
		<div>
			{coin?.name ? (
				<Row>
					<Col span={9}>
						<Space direction="vertical">
							<div style={{ paddingBlockEnd: '1.2rem', fontWeight: 600, fontSize: '0.8rem' }}>
								Cryptocurrency &gt; {coin.category} &gt; {coin.name}
							</div>
							<Space direction="horizontal" align="center">
								<div>
									<Image src={coin.logo} alt={`${coin.id}`} width={40} height={40} />
								</div>
								<div>
									<Typography.Text style={{ fontSize: '2.3rem', fontWeight: 700 }}>
										{coin.name}
									</Typography.Text>
								</div>
								<Tag color="#a3b1c9" bordered={false}>
									{coin.symbol}
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
						</Space>
						<div style={{ paddingBlockStart: '1rem' }}>
							<Space direction="horizontal" wrap>
								<Tag icon={<LinkOutlined />} closeIcon={<ShareAltOutlined />}>
									<Link href={coin.urls.website[0]} target="_blank">
										<span style={{ fontWeight: 700 }}>{extractDomain(coin.urls.website[0])}</span>
									</Link>
								</Tag>
								<Tag icon={<ExclamationCircleOutlined />} closable={false}>
									<Dropdown
										menu={{
											items: coin?.urls.explorer.map((item, index) => ({
												key: index,
												label: (
													<Link target="_blank" href={item}>
														{extractDomain(item)}
													</Link>
												)
											}))
										}}
										placement="bottom"
										arrow
									>
										<span style={{ fontWeight: 700 }}>
											Explorers
											<DownOutlined style={{ paddingLeft: '5px' }} />
										</span>
									</Dropdown>
								</Tag>
								<Tag icon={<ExclamationCircleOutlined />} closable={false}>
									<Dropdown
										menu={{
											items: coin?.urls.message_board.map((item, index) => ({
												key: index,
												label: (
													<Link target="_blank" href={item}>
														{extractDomain(item)}
													</Link>
												)
											}))
										}}
										placement="bottom"
										arrow
									>
										<span style={{ fontWeight: 700 }}>
											Forum
											<DownOutlined style={{ paddingLeft: '5px' }} />
										</span>
									</Dropdown>
								</Tag>
								<Tag icon={<LinkOutlined />} closeIcon={<ShareAltOutlined />}>
									<Link href={coin.urls.website[0]} target="_blank">
										<span style={{ fontWeight: 700 }}>{extractDomain(coin.urls.reddit[0])}</span>
									</Link>
								</Tag>
								<Tag icon={<ExclamationCircleOutlined />} closable={false}>
									<Dropdown
										menu={{
											items: coin?.urls.source_code.map((item, index) => ({
												key: index,
												label: (
													<Link target="_blank" href={item}>
														{extractDomain(item)}
													</Link>
												)
											}))
										}}
										placement="bottom"
										arrow
									>
										<span style={{ fontWeight: 700 }}>
											Source Code
											<DownOutlined style={{ paddingLeft: '5px' }} />
										</span>
									</Dropdown>
								</Tag>
							</Space>
						</div>
					</Col>
					<Col span={15}>
						<div>
							{coin.name} Price ({coin.symbol})
						</div>
						<Space style={{ paddingBlockStart: '2.5rem' }}>
							<div>
								<Typography.Text style={{ fontSize: '2.3rem', fontWeight: 700 }}>
									{formatPrice(sign, quotes?.quote[symbol]?.price)}
								</Typography.Text>
							</div>
							<div>{renderPercentage(quotes.quote[symbol].percent_change_24h)}</div>
						</Space>
						<Divider />
						<Row gutter={16}>
							<Col span={6}>
								<Typography.Text strong>Market Cap:</Typography.Text>
								<div style={{ paddingBlockStart: '1rem' }}>
									{formatPrice(sign, quotes.quote[symbol].market_cap)}
								</div>
							</Col>
							<Col span={6}>
								<Typography.Text strong>Fully Diluted Market Cap:</Typography.Text>
								<div style={{ paddingBlockStart: '1rem' }}>
									{formatPrice(sign, quotes.quote[symbol].fully_diluted_market_cap)}
								</div>
							</Col>
							<Col span={6}>
								<Typography.Text strong>Volume:</Typography.Text>

								<div style={{ paddingBlock: '1rem' }}>
									{formatPrice(sign, quotes.quote[symbol].volume_24h)}
								</div>
								<Typography.Text strong>Volume / MarketCap:</Typography.Text>
								<div style={{ paddingBlock: '1rem' }}>
									{(
										(quotes.quote[symbol].volume_24h / quotes.quote[symbol].market_cap) *
										100
									).toFixed(2)}
									%
								</div>
							</Col>
							<Col span={6}>
								<Typography.Text strong>Circulating Supply:</Typography.Text>
								<div style={{ paddingBlock: '1rem' }}>
									{numberWithCommas(quotes.circulating_supply)}
								</div>
								<div style={{ paddingBlockStart: '1rem' }}>
									<Typography.Text strong>Max Supply: </Typography.Text>
									{numberWithCommas(quotes.max_supply)}
								</div>
								<div style={{}}>
									<Typography.Text strong>Total Supply: </Typography.Text>
									{numberWithCommas(quotes.total_supply)}
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
			) : (
				<Spin size="large" />
			)}
		</div>
	)
}

export default Detail
