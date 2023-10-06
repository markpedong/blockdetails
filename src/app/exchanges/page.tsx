import { TExchange, getExchanges, getExchangesPaprika } from '@/api'
import Table from './table'

const Exchanges = async ({ searchParams: { currency } }: { searchParams?: { currency?: string } }) => {
	const [exchanges, pap] = await Promise.all([
		getExchanges({ per_page: 250 }) as unknown as TExchange[],
		getExchangesPaprika({ quotes: currency ?? 'USD' })
	])
	const filtered = pap?.filter(exchange => exchange.active === true && exchange.website_status === true)

	return <Table data={exchanges} pap={filtered} />
}

export default Exchanges
