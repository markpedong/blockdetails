import { ExchangeDetail, getExchangesDetail, getExchangesPaprika } from '@/api'
import Detail from './components/detail'

const Exchanges = async ({ params, searchParams: { currency } }) => {
	const [data, exchanges] = await Promise.all([
		getExchangesDetail(params.id) as unknown as ExchangeDetail,
		// SOME OF THE CURRENCY THAT IS SUPPORTED ON CMC IS NOT SUPPORTED ON PAPRIKA
		getExchangesPaprika({ quotes: currency })
	])

	const filtered = exchanges?.filter(exchange => exchange.active === true && exchange.website_status === true)
	const pap = filtered?.find(paprika => paprika.id === params.id || paprika.name === data?.name)

	return <Detail exchange={data} pap={pap} id={params.id} />
}

export default Exchanges
