'use client'

import { CoinData, CoinDataCG, getCoinDetail, getDetail, getMarketChart, getQuotesLatest } from '@/api'
import { formatPrice } from '@/constants'
import { AppDispatch, useAppSelector } from '@/redux/store'
import {
	AreaChartOutlined,
	InfoCircleOutlined,
	LineChartOutlined,
	SlidersOutlined,
	SolutionOutlined,
	WalletOutlined
} from '@ant-design/icons'
import { Col, Divider, Row, Segmented, Space, Spin, Tag, Typography } from 'antd'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { renderPercentage } from '@/utils/antd'
import { useDispatch } from 'react-redux'
import { setCoin } from '@/redux/features/coinSlice'
import { setQuotes } from '@/redux/features/quoteSlice'
import { setCoinCG } from '@/redux/features/coinGSlice'
import Statistics from './components/statistics'
import LinksDropdown from './components/links-dropdown'
import { setChart } from '@/redux/features/chartSlice'
import ChartData from './components/chart-data'
import MarketData from './components/market-data'

const Detail: FC = ({ params }: { params: any }) => {
	const [currentTab, setCurrentTab] = useState('overview')
	const { symbol, sign } = useAppSelector(state => state.setCurrency.value)
	const coin = useAppSelector(state => state.setCoin.value)
	const quotes = useAppSelector(state => state.setQuotes.value)
	const dispatch = useDispatch<AppDispatch>()

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

		dispatch(setCoin(Object.values(data.data)[0] as CoinData))
		dispatch(setQuotes(Object.values(quoteData.data)[0] as unknown as any))
		dispatch(setCoinCG(coin as unknown as CoinDataCG))
		dispatch(
			setChart(
				marketData.prices.map(i => ({
					date: i[0],
					value: i[1]
				}))
			)
		)
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
									Rank #{quotes?.cmc_rank}
								</Tag>
								<Tag color="#a3b1c9" bordered={false}>
									{coin.category}
								</Tag>
							</Space>
						</Space>
						{/* LINKS DISPLAYED */}
						<div style={{ paddingBlockStart: '1rem' }}>
							<Space direction="horizontal" wrap>
								<LinksDropdown data={coin.urls.website[0]} />
								<LinksDropdown dataArr={coin?.urls.explorer} title="Explorers" />
								<LinksDropdown dataArr={coin?.urls.message_board} title="Forum" />
								<LinksDropdown data={coin.urls.reddit[0]} />
								<LinksDropdown dataArr={coin?.urls.source_code} title="Source Code" />
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
							<div>{renderPercentage(quotes?.quote[symbol].percent_change_24h)}</div>
						</Space>
						<Divider />
						<Row gutter={16}>
							<MarketData title="Market Cap" data={quotes.quote[symbol].market_cap} />
							<MarketData
								title="Fully Diluted Market Cap"
								data={quotes.quote[symbol].fully_diluted_market_cap}
							/>
							<MarketData title="Volume" data={quotes.quote[symbol].volume_24h} volMcap />
							<MarketData title="Circulating Supply" supply />
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
								{/* CHART DATA AND DESCRIPTION */}
								<ChartData />
								<Col span={1} />
								{/* STATISTICS DATA */}
								<Statistics />
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
