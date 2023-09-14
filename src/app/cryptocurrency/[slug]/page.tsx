import { CoinData, QuoteData, getAllCoinIds, getDetail, getQuotesLatest } from '@/api'
import Details from './components/details/page'

const Detail = async ({ params }: { params: { slug: string } }) => {
	const coinIds = await getAllCoinIds()
	const { id } = coinIds?.find(i => i.name.toLowerCase() === params.slug)
	const [data, quoteData] = await Promise.all([
		getDetail({
			slug: params.slug,
			aux: 'urls,logo,description,tags,platform,date_added,notice,status'
		}),
		getQuotesLatest({
			slug: params.slug,
			aux: 'num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat'
		}),

		getAllCoinIds()
	])
	// const [coin, marketData] = await Promise.all([
	// 	getCoinDetail(coinID),
	// 	getMarketChart(coinID, {
	// 		vs_currency: symbol.toLowerCase(),
	// 		days: '30'
	// 	})
	// ])

	// dispatch(setCoinCG(coin as unknown as CoinDataCG))
	// dispatch(
	// 	setChart(
	// 		marketData.prices?.map(i => ({
	// 			date: i[0],
	// 			value: i[1]
	// 		}))
	// 	)
	// )

	return (
		<Details
			coin={Object.values(data.data)[0] as CoinData}
			quotes={Object.values(quoteData.data)[0] as QuoteData}
		/>
	)
}

export default Detail
