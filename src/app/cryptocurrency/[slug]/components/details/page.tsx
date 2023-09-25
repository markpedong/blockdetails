'use client'

import { CoinData, CoinDataCG, CoinMarketResponse, GlobalData, QuoteData } from '@/api'
import { Col, Divider, Row, Segmented, Space, Tag, Typography } from 'antd'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import LinksDropdown from '../links-dropdown'
import { formatPrice } from '@/utils'
import { renderPercentage } from '@/utils/antd'
import MarketData from '../market-data'
import {
	AreaChartOutlined,
	InfoCircleOutlined,
	LineChartOutlined,
	SlidersOutlined,
	SolutionOutlined,
	WalletOutlined
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { setCoin, setQuotes } from '@/redux/features/coinSlice'
import ChartData from '../chart-data'
import Statistics from '../statistics'
import { setChart, setCoinCG } from '@/redux/features/coinGSlice'
import Markets from '../markets'
import Wallets from '../wallets'
import { setGlobalData } from '@/redux/features/globalSlice'

type Props = {
	coin: CoinData
	quotes: QuoteData
	cg: CoinDataCG
	id: string
	markets: CoinMarketResponse
	chart: { date: string; value: number }[]
	global: GlobalData
}

const Details: FC<Props> = ({ coin, markets, quotes, cg, chart, id, global }: Props) => {
	const { sign, symbol } = useAppSelector(state => state.global.currency)
	const [currentTab, setCurrentTab] = useState('overview')
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		dispatch(setCoin(coin))
		dispatch(setGlobalData(global))
		dispatch(setQuotes(quotes))
		dispatch(setCoinCG(cg))
		dispatch(setChart(chart))
	}, [sign, symbol])

	return (
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
						<LinksDropdown data={coin.urls?.website[0]} />
						<LinksDropdown dataArr={coin?.urls?.explorer} title="Explorers" />
						<LinksDropdown dataArr={coin?.urls?.message_board} title="Forum" />
						<LinksDropdown data={coin.urls?.reddit[0]} />
						<LinksDropdown dataArr={coin?.urls?.source_code} title="Source Code" />
					</Space>
				</div>
			</Col>
			<Col span={15}>
				<Typography.Paragraph>
					{coin.name} Price ({coin.symbol})
				</Typography.Paragraph>
				<Space>
					<div>
						<Typography.Text style={{ fontSize: '2.3rem', fontWeight: 700 }}>
							{formatPrice(quotes?.quote?.[symbol]?.price, sign)}
						</Typography.Text>
					</div>
					<div>{renderPercentage(quotes?.quote?.[symbol]?.percent_change_24h)}</div>
				</Space>
				<Divider />
				<Row gutter={16}>
					<MarketData title="Market Cap" data={quotes.quote?.[symbol]?.market_cap} />
					<MarketData
						title="Fully Diluted Market Cap"
						data={quotes.quote?.[symbol]?.fully_diluted_market_cap}
					/>
					<MarketData title="Volume" data={quotes.quote?.[symbol]?.volume_24h} volMcap />
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
							label: 'Wallets',
							value: 'wallets',
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
							<Typography.Title level={4}>{coin.name} to USD chart</Typography.Title>
						</Col>
						{/* CHART DATA AND DESCRIPTION */}
						<ChartData />
						<Col span={1} />
						{/* STATISTICS DATA */}
						<Statistics />
						<Col span={24}>
							<Markets data={markets.tickers} id={id} />
						</Col>
					</Row>
				)}
				{currentTab === 'markets' && <Markets data={markets.tickers} id={id} tab="markets" />}
				{currentTab === 'wallets' && <Wallets />}
			</Col>
		</Row>
	)
}

export default Details
