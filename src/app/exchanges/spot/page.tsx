import { Exchange, getExchanges } from '@/api'
import Table from './table'

const Spot = async () => {
	// LOCALSTORAGE???
	const exchanges = (await getExchanges({})) as unknown as Exchange[]

	return <Table data={exchanges} />
}

export default Spot
