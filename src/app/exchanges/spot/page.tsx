import { Exchange, getExchanges } from '@/api'
import Table from './table'

const Spot = async ({ searchParams: { currency } }) => {
	const [exchanges] = await Promise.all([getExchanges({}) as unknown as Exchange[]])

	return <Table data={exchanges} />
}

export default Spot
