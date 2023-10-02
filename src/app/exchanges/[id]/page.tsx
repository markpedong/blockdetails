import { CGCoinData, ExchangeDetail, ExchangePap, getCoinList, getExchangesDetail, getExchangesPaprika } from '@/api'
import Detail from './components/detail'

const Exchanges = async ({ params, searchParams: { currency } }) => {
	const [data, coins, pap] = await Promise.all([
		getExchangesDetail(params.id) as unknown as ExchangeDetail,
		getCoinList({
			vs_currency: currency?.toLowerCase() ?? 'usd',
			order: 'market_cap_desc'
		}) as unknown as CGCoinData[],
		getExchangesPaprika({ quotes: currency ?? 'USD' }) as unknown as ExchangePap[]
	])

	return <Detail exchange={data} id={params.id} cg={coins} pap={pap} />
}

export default Exchanges
