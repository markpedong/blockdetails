import { Exchange, getExchanges, getExchangesPaprika } from '@/api'
import Table from './table'

const Spot = async ({ searchParams: { currency } }: { searchParams?: { currency?: string } }) => {
	const [exchanges, pap] = await Promise.all([
		getExchanges({ per_page: 250 }) as unknown as Exchange[],
		getExchangesPaprika({ quotes: currency ?? 'USD' })
	])
	const filtered = pap?.filter(exchange => exchange.active === true && exchange.website_status === true)

	return <Table data={exchanges} pap={filtered} />
}

export default Spot
