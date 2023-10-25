import { TExchange, getExchanges, getExchangesPaprika } from '@/api'
import Table from './table'
import { PAP_FIAT } from '@/constants'

const Exchanges = async ({ searchParams: { currency } }: { searchParams?: { currency?: string } }) => {
	const papCurrency = PAP_FIAT.includes(currency)
	const [exchanges, pap] = await Promise.all([
		getExchanges({ per_page: 250 }) as unknown as TExchange[],
		getExchangesPaprika({ quotes: papCurrency ? currency : 'USD' })
	])
	const filtered = pap?.filter(exchange => exchange.active === true && exchange.website_status === true)

	return <Table data={exchanges} pap={filtered} />
}

export default Exchanges
