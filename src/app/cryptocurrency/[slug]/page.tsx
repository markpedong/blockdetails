import {
	CoinData,
	CoinDataCG,
	QuoteData,
	getAllCoinIds,
	getCoinDetail,
	getDetail,
	getMarketChart,
	getQuotesLatest
} from '@/api'
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
	const [cg, chart] = await Promise.all([
		getCoinDetail(id),
		getMarketChart(id, {
			vs_currency: 'usd',
			days: '1'
		})
	])

	return (
		<Details
			coin={Object.values(data.data)[0] as CoinData}
			quotes={Object.values(quoteData.data)[0] as QuoteData}
			cg={cg as unknown as CoinDataCG}
			chart={chart.prices?.map(i => {
				return {
					date: i[0],
					value: i[1]
				}
			})}
		/>
	)
}

export default Detail
