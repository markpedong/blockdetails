import {
	CGCoinData,
	TExchangeDetail,
	ExchangePap,
	getCoinList,
	getExchangeChart,
	getExchangesDetail,
	getExchangesPaprika
} from '@/_api'
import ExchangeDetail from './components/detail'

const Detail = async ({ params, searchParams: { currency } }) => {
	const [data, coins, pap, chart] = await Promise.all([
		getExchangesDetail(params.id) as unknown as TExchangeDetail,
		getCoinList({
			vs_currency: currency?.toLowerCase() ?? 'usd',
			order: 'market_cap_desc'
		}) as unknown as CGCoinData[],
		getExchangesPaprika({ quotes: currency ?? 'USD' }) as unknown as ExchangePap[],
		getExchangeChart(params.id, { days: 1 })
	])

	return (
		<ExchangeDetail
			exchange={data}
			id={params.id}
			cg={coins}
			pap={pap}
			chart={
				chart?.map(i => ({
					date: i[0],
					value: Number(i[1])
				})) ?? []
			}
		/>
	)
}

export default Detail
