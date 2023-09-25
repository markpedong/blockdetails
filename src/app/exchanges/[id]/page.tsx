import { ExchangeDetail, getExchangesDetail, getExchangesPaprika, getGlobalCrypto } from '@/api'
import Detail from './components/detail'

const Exchanges = async ({ params, searchParams: { currency } }) => {
	const [data, exchanges, global] = await Promise.all([
		getExchangesDetail(params.id) as unknown as ExchangeDetail,
		// SOME OF THE CURRENCY THAT IS SUPPORTED ON CMC IS NOT SUPPORTED ON PAPRIKA
		getExchangesPaprika({ quotes: 'USD' }),
		getGlobalCrypto({
			convert: currency
		})
	])

	const filtered = exchanges?.filter(exchange => exchange.active === true && exchange.website_status === true)
	const pap = filtered?.find(paprika => paprika.id === params.id || paprika.name === data?.name)

	return <Detail exchange={data} pap={pap} id={params.id} global={global.data} />
}

export default Exchanges
