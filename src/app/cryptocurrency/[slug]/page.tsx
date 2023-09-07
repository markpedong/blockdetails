'use client'

import { CoinData, CoinDataCG, QuoteData, getCoinDetail, getDetail, getMarketChart, getQuotesLatest } from '@/api'
import { formatPrice } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { extractDomain, numberWithCommas, renderPer } from '@/utils'
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
import { Card, Col, Divider, Dropdown, Row, Segmented, Space, Spin, Tag, Typography } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { renderPercentage } from '@/utils/antd'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import StatisticsData from './components/statistics'

const Line = dynamic(() => import('@ant-design/charts').then(i => i.Line))

const Detail: FC = ({ params }: { params: any }) => {
	const [coin, setCoin] = useState<CoinData>()
	const [quotes, setQuotes] = useState<QuoteData>()
	const [coinCG, setCoinCG] = useState<CoinDataCG>()

	const [currentTab, setCurrentTab] = useState('overview')
	const [marketData, setMarketData] = useState([])
	const { symbol, sign } = useAppSelector(state => state.setCurrency.value)

	console.log(coin)
	console.log(quotes)

	// const data = [
	// 	{ year: '09/04/2023', value: 20000 },
	// 	{ year: '09/04/2023', value: 20000 },
	// 	{ year: '09/04/2023', value: 20000 },
	// 	{ year: '09/05/2023', value: 25000 },
	// 	{ year: '09/05/2023', value: 25000 },
	// 	{ year: '09/05/2023', value: 25000 },
	// 	{ year: '09/05/2023', value: 25000 },
	// 	{ year: '09/05/2023', value: 25000 }
	// ]

	const initData = async () => {
		const [data, quoteData, marketData, coin] = await Promise.all([
			getDetail({
				slug: params.slug,
				aux: 'urls,logo,description,tags,platform,date_added,notice,status'
			}),
			getQuotesLatest({
				slug: params.slug,
				aux: 'num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat'
			}),
			getMarketChart(params.slug, {
				vs_currency: symbol.toLowerCase(),
				days: '30'
			}),
			getCoinDetail(params.slug)
		])

		setMarketData(
			marketData.prices.map(i => ({
				date: i[0],
				value: i[1]
			}))
		)
		setCoin(Object.values(data.data)[0] as CoinData)
		setQuotes(Object.values(quoteData.data)[0] as unknown as any)
		setCoinCG(coin as unknown as CoinDataCG)
	}

	const lowestValue = marketData.reduce(
		(acc, curr) => (curr.value < acc.value ? curr : acc),
		marketData[0] || undefined
	)

	console.log(lowestValue, 'lowestValue')

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
							<Row gutter={24}>
								<Col span={24}>
									<Typography.Title level={4}>
										{coin.name} to {symbol} chart
									</Typography.Title>
								</Col>
								<Col span={14}>
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
										style={{ marginBlockEnd: '50px' }}
									/>
									<Line
										data={marketData}
										yAxis={{ min: lowestValue.value }}
										xField="date"
										yField="value"
										annotations={[
											// 低于中位数颜色变化
											// MUST FIX THIS, THE LINE MUST BE IN THE MIDDLE
											{
												type: 'regionFilter',
												start: ['min', 'median'],
												end: ['max', '0'],
												color: '#F4664A'
											},
											{
												type: 'text',
												position: ['min', 'median'],
												content: '中位数',
												offsetY: -4,
												style: {
													textBaseline: 'bottom'
												}
											},
											{
												type: 'line',
												start: ['min', 'median'],
												end: ['max', 'median'],
												style: {
													stroke: '#F4664A',
													lineDash: [2, 2]
												}
											}
										]}
									/>
									<div>
										<Typography.Title level={4}>{coin.symbol} Price Live Data</Typography.Title>
										<Typography.Text>
											The live Bitcoin price today is{' '}
											{formatPrice(sign, quotes.quote[symbol]?.price)} {symbol} with a 24-hour
											trading volume of {formatPrice(sign, quotes.quote[symbol]?.volume_24h)}
											{symbol}. We update our {coin.symbol} to {symbol} price in real-time.
											{coin.name} is{' '}
											{quotes.quote[symbol]?.percent_change_24h > 1 ? 'up' : 'down'}
											{renderPer(quotes.quote[symbol]?.percent_change_24h)} in the last 24 hours.
											The current ranking is #{quotes.cmc_rank}, with a live market cap of{' '}
											{formatPrice(sign, quotes.quote[symbol]?.market_cap)} {symbol}. It has a
											circulating supply of {numberWithCommas(quotes.circulating_supply)}{' '}
											{coin.symbol} coins and a max. supply of{' '}
											{numberWithCommas(quotes.max_supply)} {coin.symbol} coins. If you would like
											to know where to buy {coin.name} at the current rate, the top cryptocurrency
											exchanges for trading in Bitcoinstock are currently WhiteBIT, Binance,
											DigiFinex, BitMart and Bitrue. You can find others listed on our crypto
											exchanges page.
										</Typography.Text>
										<Typography.Title level={4}>
											{coin.symbol} What is ({coin.symbol})?
										</Typography.Title>
										<Typography.Text>{coin.description}</Typography.Text>
									</div>
								</Col>
								<Col span={1} />
								<Col span={9}>
									<Card title={`${coin.symbol} Price Statistics`} bordered>
										<Divider orientation="left">{coin.name} Price Today</Divider>
										<div style={{ justifyContent: 'space-between', display: 'flex' }}>
											<Typography.Text type="secondary">{coin.name} Price</Typography.Text>
											<Typography.Text strong>
												{formatPrice(sign, quotes.quote[symbol]?.price)}
											</Typography.Text>
										</div>
										<Divider />
										{/* <div style={{ justifyContent: 'space-between', display: 'flex' }}>
											<Typography.Text type="secondary">Price Change (24h)</Typography.Text>
											<Typography.Text strong>
												{renderPer(quotes.quote[symbol]?.percent_change_24h)}
											</Typography.Text>
										</div>
										<Divider /> */}
										<StatisticsData
											title="Price Change (24h)"
											data={coinCG.market_data.price_change_24h_in_currency[
												symbol.toLowerCase()
											].toFixed(2)}
											per={quotes.quote[symbol]?.percent_change_24h}
										/>
										<div style={{ justifyContent: 'space-between', display: 'flex' }}>
											<Typography.Text type="secondary">Trading Volume (24h)</Typography.Text>
											<Typography.Text strong>
												{formatPrice(sign, quotes.quote[symbol]?.volume_24h)}
											</Typography.Text>
										</div>
										<Divider />
										<div style={{ justifyContent: 'space-between', display: 'flex' }}>
											<Typography.Text type="secondary">Market Rank</Typography.Text>
											<Typography.Text strong># {quotes.cmc_rank}</Typography.Text>
										</div>
										<Divider orientation="left" style={{ paddingTop: '20px' }}>
											{coin.name} Market Cap
										</Divider>
										<div style={{ justifyContent: 'space-between', display: 'flex' }}>
											<Typography.Text type="secondary">Market Cap</Typography.Text>
											<Typography.Text strong>
												{formatPrice(sign, quotes.quote[symbol]?.price)}
											</Typography.Text>
										</div>
										<Divider />
										<div style={{ justifyContent: 'space-between', display: 'flex' }}>
											<Typography.Text type="secondary">Fully Diluted Market Cap</Typography.Text>
											<Typography.Text strong>
												{formatPrice(sign, quotes.quote[symbol]?.fully_diluted_market_cap)}
											</Typography.Text>
										</div>
										<Divider orientation="left" style={{ paddingTop: '20px' }}>
											{coin.name} Price History
										</Divider>
										<StatisticsData
											title="7d Price Percentage Change"
											data={coinCG.market_data.price_change_percentage_7d_in_currency[
												symbol.toLowerCase()
											].toFixed(2)}
											per={coinCG.market_data.price_change_percentage_7d}
										/>
										<StatisticsData
											title="30d Price Percentage Change"
											data={coinCG.market_data.price_change_percentage_30d_in_currency[
												symbol.toLowerCase()
											].toFixed(2)}
											per={coinCG.market_data.price_change_percentage_30d}
										/>
										<StatisticsData
											title="60d Price Percentage Change"
											data={coinCG.market_data.price_change_percentage_60d_in_currency[
												symbol.toLowerCase()
											].toFixed(2)}
											per={coinCG.market_data.price_change_percentage_60d}
										/>
										<StatisticsData
											title="52w Price Percentage Change"
											data={coinCG.market_data.price_change_percentage_1y_in_currency[
												symbol.toLowerCase()
											].toFixed(2)}
											per={coinCG.market_data.price_change_percentage_1y}
										/>
										<StatisticsData
											title="All Time High"
											data={coinCG.market_data.ath[symbol.toLowerCase()]}
											date={coinCG.market_data.ath_date[symbol.toLowerCase()]}
											per={coinCG.market_data.ath_change_percentage[symbol.toLowerCase()]}
										/>
										<StatisticsData
											title="All Time Low"
											data={coinCG.market_data.atl[symbol.toLowerCase()]}
											date={coinCG.market_data.atl_date[symbol.toLowerCase()]}
											per={coinCG.market_data.atl_change_percentage[symbol.toLowerCase()]}
											divider={false}
										/>
										<Divider orientation="left" style={{ paddingTop: '20px' }}>
											{coin.name} Supply
										</Divider>
										<div style={{ justifyContent: 'space-between', display: 'flex' }}>
											<Typography.Text type="secondary">Circulating Supply</Typography.Text>
											<Typography.Text strong>
												{numberWithCommas(quotes?.circulating_supply)} {coin.symbol}
											</Typography.Text>
										</div>
										<Divider />
										<div style={{ justifyContent: 'space-between', display: 'flex' }}>
											<Typography.Text type="secondary">Total Supply</Typography.Text>
											<Typography.Text strong>
												{numberWithCommas(quotes?.total_supply)} {coin.symbol}
											</Typography.Text>
										</div>
										<Divider />
										<div style={{ justifyContent: 'space-between', display: 'flex' }}>
											<Typography.Text type="secondary">Max Supply</Typography.Text>
											<Typography.Text strong>
												{numberWithCommas(quotes?.max_supply)} {coin.symbol}
											</Typography.Text>
										</div>
										<Divider />
									</Card>
								</Col>
							</Row>
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
