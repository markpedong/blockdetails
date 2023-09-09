import { Card, Col, Divider } from 'antd'
import React, { FC } from 'react'
import StatsTitle from './statsTitle'
import StatsPer from './statsPer'
import { useAppSelector } from '@/redux/store'

const Statistics: FC = () => {
	const { symbol } = useAppSelector(state => state.setCurrency.value)
	const coin = useAppSelector(state => state.setCoin.value)
	const quotes = useAppSelector(state => state.setQuotes.value)
	const coinCG = useAppSelector(state => state.setCoinCG.value)

	console.log(coinCG)

	return (
		<Col span={9}>
			<Card title={`${coin.symbol} Price Statistics`} bordered>
				<StatsTitle title={`${coin.name} Price`} dataSign={quotes.quote[symbol]?.price} />
				<StatsPer
					title="Price Change (24h)"
					data={coinCG.market_data?.price_change_24h_in_currency[symbol.toLowerCase()]?.toFixed(2)}
					per={quotes.quote[symbol]?.percent_change_24h}
				/>
				<StatsTitle title="Trading Volume (24h)" dataSign={quotes.quote[symbol]?.volume_24h} />
				<StatsTitle title="Market Rank" data={`# ${quotes.cmc_rank}`} />
				<Divider orientation="left" style={{ paddingTop: '20px' }}>
					{coin.name} Market Cap
				</Divider>
				<StatsTitle title="Market Cap" dataSign={quotes.quote[symbol]?.price} />
				<StatsTitle
					title="Fully Diluted Market Cap"
					dataSign={quotes.quote[symbol]?.fully_diluted_market_cap}
					divider={false}
				/>
				<Divider orientation="left" style={{ paddingTop: '20px' }}>
					{coin.name} Price History
				</Divider>
				<StatsPer
					title="7d Price Percentage Change"
					data={coinCG.market_data?.price_change_percentage_7d_in_currency[symbol.toLowerCase()]?.toFixed(2)}
					per={coinCG.market_data?.price_change_percentage_7d}
				/>
				<StatsPer
					title="30d Price Percentage Change"
					data={coinCG.market_data?.price_change_percentage_30d_in_currency[symbol.toLowerCase()]?.toFixed(2)}
					per={coinCG.market_data?.price_change_percentage_30d}
				/>
				<StatsPer
					title="60d Price Percentage Change"
					data={coinCG.market_data?.price_change_percentage_60d_in_currency[symbol.toLowerCase()]?.toFixed(2)}
					per={coinCG.market_data?.price_change_percentage_60d}
				/>
				<StatsPer
					title="52w Price Percentage Change"
					data={coinCG.market_data?.price_change_percentage_1y_in_currency[symbol.toLowerCase()]?.toFixed(2)}
					per={coinCG.market_data?.price_change_percentage_1y}
				/>
				<StatsPer
					title="All Time High"
					data={coinCG.market_data?.ath[symbol.toLowerCase()]}
					date={coinCG.market_data?.ath_date[symbol.toLowerCase()]}
					per={coinCG.market_data?.ath_change_percentage[symbol.toLowerCase()]}
				/>
				<StatsPer
					title="All Time Low"
					data={coinCG.market_data?.atl[symbol.toLowerCase()]}
					date={coinCG.market_data?.atl_date[symbol.toLowerCase()]}
					per={coinCG.market_data?.atl_change_percentage[symbol.toLowerCase()]}
				/>
				<Divider orientation="left" style={{ paddingTop: '20px' }}>
					{coin.name} Supply
				</Divider>
				<StatsTitle title="Circulating Supply" dataSym={quotes.circulating_supply} />
				<StatsTitle title="Total Supply" dataSym={quotes.total_supply} />
				<StatsTitle title="Max Supply" dataSym={coinCG?.market_data?.max_supply} />
			</Card>
		</Col>
	)
}

export default Statistics
