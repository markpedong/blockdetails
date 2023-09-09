import { formatPrice } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { numberWithCommas, renderPer } from '@/utils'
import { Typography } from 'antd'
import React, { FC } from 'react'

const Description: FC = () => {
	const { symbol, sign } = useAppSelector(state => state.setCurrency.value)
	const coin = useAppSelector(state => state.setCoin.value)
	const coinCG = useAppSelector(state => state.setCoinCG.value)
	const quotes = useAppSelector(state => state.setQuotes.value)

	return (
		<div>
			<Typography.Title level={4}>{coin.symbol} Price Live Data</Typography.Title>
			<Typography.Text>
				The live {coin.name} price today is {formatPrice(sign, quotes.quote[symbol]?.price)} {symbol} with a
				24-hour trading volume of {formatPrice(sign, quotes.quote[symbol]?.volume_24h)}
				{symbol}. We update our {coin.symbol} to {symbol} price in real-time.
				{coin.name} is {quotes.quote[symbol]?.percent_change_24h > 0.01 ? 'up' : 'down'}
				{renderPer(quotes.quote[symbol]?.percent_change_24h)} in the last 24 hours. The current ranking is #
				{quotes.cmc_rank}, with a live market cap of {formatPrice(sign, quotes.quote[symbol]?.market_cap)}{' '}
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
