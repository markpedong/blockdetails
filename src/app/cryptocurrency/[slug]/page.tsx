'use client'

import { CoinData, QuoteData, getDetail, getQuotesLatest } from '@/api'
import { formatPrice } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { extractDomain, numberWithCommas } from '@/utils'
import { renderPercentage } from '@/utils/antd'
import { Line } from '@ant-design/plots'
import {
	AreaChartOutlined,
	DollarOutlined,
	DownOutlined,
	ExclamationCircleOutlined,
	InfoCircleOutlined,
	LineChartOutlined,
	LinkOutlined,
	PieChartOutlined,
	RadarChartOutlined,
	ShareAltOutlined,
	SlidersOutlined,
	SolutionOutlined,
	WalletOutlined
} from '@ant-design/icons'
import { Col, Divider, Dropdown, Row, Segmented, Space, Spin, Statistic, Tag, Typography } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { ProCard } from '@ant-design/pro-components'

const Detail: FC = ({ params }: { params: any }) => {
	const [coin, setCoin] = useState<CoinData>()
	const [quotes, setQuotes] = useState<QuoteData>()
	const [currentTab, setCurrentTab] = useState('overview')
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

	const data = [
		{ year: '1991', value: 3 },
		{ year: '1992', value: 4 },
		{ year: '1993', value: 3.5 },
		{ year: '1994', value: 5 },
		{ year: '1995', value: 4.9 },
		{ year: '1996', value: 6 },
		{ year: '1997', value: 7 },
		{ year: '1998', value: 9 },
		{ year: '1999', value: 13 }
	]

	const config = {
		data,
		height: 400,
		xField: 'year',
		yField: 'value',
		point: {
			size: 5,
			shape: 'diamond'
		}
	}

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
							<Col span={5.5}>
								<Typography.Text strong>Market Cap:</Typography.Text>
								<div style={{ paddingBlockStart: '1rem' }}>
									{formatPrice(sign, quotes.quote[symbol].market_cap)}
								</div>
							</Col>
							<Col span={0.5}>
								<Divider type="vertical" style={{ blockSize: '100%' }} />
							</Col>
							<Col span={5.5}>
								<Typography.Text strong>Fully Diluted Market Cap:</Typography.Text>
								<div style={{ paddingBlockStart: '1rem' }}>
									{formatPrice(sign, quotes.quote[symbol].fully_diluted_market_cap)}
								</div>
							</Col>
							<Col span={0.5}>
								<Divider type="vertical" style={{ blockSize: '100%' }} />
							</Col>
							<Col span={5.5}>
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
							<Col span={0.5}>
								<Divider type="vertical" style={{ blockSize: '100%' }} />
							</Col>
							<Col span={5.5}>
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
							<Col span={0.5}>
								<Divider type="vertical" style={{ blockSize: '100%' }} />
							</Col>
						</Row>
					</Col>
					<Divider />
					<Col span={24}>
						<Segmented
							onChange={(val: string) => setCurrentTab(val)}
							defaultValue="overview"
							size="large"
							options={[
								{
									label: 'Overview',
									value: 'overview',
									icon: <AreaChartOutlined />
								},
								{
									label: 'Markets',
									value: 'markets',
									icon: <SlidersOutlined />
								},
								{
									label: 'Wallet',
									value: 'wallet',
									icon: <WalletOutlined />
								},
								{
									label: 'News',
									value: 'news',
									icon: <SolutionOutlined />
								},
								{
									label: 'About',
									value: 'about',
									icon: <InfoCircleOutlined />
								},
								{
									label: 'Analytics',
									value: 'analytics',
									icon: <LineChartOutlined />
								}
							]}
						/>
					</Col>
					<Divider />
					<Col span={24}>
						{currentTab === 'overview' && (
							<div>
								<Typography.Title level={4}>
									{coin.name} to {symbol} chart
								</Typography.Title>
								<div style={{ marginBlockStart: '1rem' }}>
									<Segmented
										// value={currentTab}
										// onChange={(val: string) => setCurrentTab(val)}
										defaultValue="price"
										size="middle"
										options={[
											{
												label: 'Price',
												value: 'price',
												icon: <DollarOutlined />
											},
											{
												label: 'Market Cap',
												value: 'marketcap',
												icon: <RadarChartOutlined />
											},
											{
												label: 'Volume',
												value: 'volume',
												icon: <PieChartOutlined />
											}
										]}
									/>
								</div>
								<Row style={{ marginBlockStart: '1rem' }}>
									<Col span={15}>
										<Line {...config} />;
									</Col>
									<Col span={9}>
										<ProCard
											style={{ marginBlockStart: 8 }}
											gutter={[16, 16]}
											wrap
											title={`${coin.symbol} Price Statistics`}
										>
											<ProCard layout="default">
												<div>Bitcoin Price Today</div>
											</ProCard>
											<Divider />
											<ProCard layout="center" bordered>
												Col
											</ProCard>
											<ProCard layout="center" bordered>
												Col
											</ProCard>
											<ProCard layout="center" bordered>
												Col
											</ProCard>
										</ProCard>
									</Col>
								</Row>
							</div>
						)}
						{currentTab === 'markets' && <div>markets</div>}
					</Col>
				</Row>
			) : (
				<div style={{ display: 'grid', placeContent: 'center' }}>
					<Spin size="large" />
				</div>
			)}
		</div>
	)
}

export default Detail
