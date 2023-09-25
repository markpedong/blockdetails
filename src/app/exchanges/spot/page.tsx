import { Exchange, getExchanges, getGlobalCrypto } from '@/api'
import Table from './table'

const Spot = async ({ searchParams: { currency } }) => {
	const [exchanges, global] = await Promise.all([
		getExchanges({}) as unknown as Exchange[],
		getGlobalCrypto({
			convert: currency
		})
	])

	return <Table data={exchanges} global={global.data} />
}

export default Spot
