import { CGCoinData, ExchangeDetail, getCoinList, getExchangesDetail, getExchangesPaprika } from '@/api'
import Detail from './components/detail'

const Exchanges = async ({ params, searchParams: { currency } }) => {
	const [data, exchanges, coins] = await Promise.all([
		getExchangesDetail(params.id) as unknown as ExchangeDetail,
		// SOME OF THE CURRENCY THAT IS SUPPORTED ON CMC IS NOT SUPPORTED ON PAPRIKA
		getExchangesPaprika({ quotes: currency ?? 'USD' }),
		getCoinList({
			vs_currency: currency?.toLowerCase() ?? 'usd',
			order: 'market_cap_desc'
		}) as unknown as CGCoinData[]
	])

	const filtered = exchanges?.filter(exchange => exchange.active === true && exchange.website_status === true)
	const pap = filtered?.find(paprika => paprika.id === params.id || paprika.name === data?.name)

	return <Detail exchange={data} pap={pap} id={params.id} cg={coins} />
}

export default Exchanges
