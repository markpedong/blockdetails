import { useAppSelector } from '@/redux/store'
import { formatPrice, numberWithCommas } from '@/utils'
import { renderPer } from '@/utils/antd'
import { Typography } from 'antd'
import React, { FC } from 'react'

const Description: FC = () => {
	const { symbol, sign } = useAppSelector(state => state.global.currency)
	const coin = useAppSelector(state => state.coin.coin)
	const coinCG = useAppSelector(state => state.coinCG.coin)
	const quotes = useAppSelector(state => state.coin.quote)

	return (
		<div>
			<Typography.Title level={4}>{coin.symbol} Price Live Data</Typography.Title>
			<Typography.Text>
				The live {coin.name} price today is {formatPrice(quotes.quote[symbol]?.price, sign)} {symbol} with a
				24-hour trading volume of {formatPrice(quotes.quote[symbol]?.volume_24h, sign)}
				{symbol}. We update our {coin.symbol} to {symbol} price in real-time.
				{coin.name} is {quotes.quote[symbol]?.percent_change_24h > 0.01 ? 'up' : 'down'}
				{renderPer(quotes.quote[symbol]?.percent_change_24h)} in the last 24 hours. The current ranking is #
				{quotes.cmc_rank}, with a live market cap of {formatPrice(quotes.quote[symbol]?.market_cap, sign)}{' '}
				{symbol}. It has a circulating supply of {numberWithCommas(quotes.circulating_supply)} {coin.symbol}{' '}
				coins and a max. supply of {numberWithCommas(quotes.max_supply)} {coin.symbol} coins. If you would like
				to know where to buy {coin.name} at the current rate, the top cryptocurrency exchanges for trading in
				Bitcoinstock are currently WhiteBIT, Binance, DigiFinex, BitMart and Bitrue. You can find others listed
				on our crypto exchanges page.
			</Typography.Text>
			<Typography.Title level={4}>What is ({coin.symbol})?</Typography.Title>
			<Typography.Text>
				<span dangerouslySetInnerHTML={{ __html: coinCG.description?.en }} />
			</Typography.Text>
		</div>
	)
}

export default Description
