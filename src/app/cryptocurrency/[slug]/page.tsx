import {
	CoinData,
	CoinDataCG,
	CoinMarketResponse,
	QuoteData,
	getAllCoinIds,
	getCoinDetail,
	getCoinMarkets,
	getDetail,
	getMarketChart,
	getQuotesLatest
} from '@/api'
import Details from './components/details'

const Detail = async ({ params, searchParams: { currency } }) => {
	const [data, quoteData, coinIds] = await Promise.all([
		getDetail({
			slug: params.slug,
			aux: 'urls,logo,description,tags,platform,date_added,notice,status'
		}),
		getQuotesLatest({
			slug: params.slug,
			convert: currency ?? 'USD',
			aux: 'num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat'
		}),
		getAllCoinIds()
	])
	const { id } =
		coinIds?.find(i => {
			const name = i.name.toLowerCase() === params.slug

			if (!name) {
				return i.id === params.slug
			}

			return name
		}) ?? ''
	const [cg, chart, markets] = await Promise.all([
		getCoinDetail(id),
		getMarketChart(id, {
			vs_currency: currency?.toLowerCase() ?? 'usd',
			days: '1'
		}),
		getCoinMarkets(
			{
				include_exchange_logo: true,
				order: 'volume_desc',
				depth: true
			},
			id
		)
	])

	return (
		<Details
			coin={Object.values(data.data)[0] as CoinData}
			markets={markets as unknown as CoinMarketResponse}
			quotes={Object.values(quoteData.data)[0] as QuoteData}
			cg={cg as unknown as CoinDataCG}
			id={id}
			chart={
				chart.prices?.map(i => ({
					date: i[0],
					value: i[1]
				})) ?? []
			}
		/>
	)
}

export default Detail
