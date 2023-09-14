import { getCryptocurrency } from '@/api'
import Table from './components/table/page'

const Tokens = async () => {
	const tokens = await getCryptocurrency({
		aux: 'cmc_rank,circulating_supply',
		limit: 5000,
		convert: 'USD',
		cryptocurrency_type: 'tokens'
	})

	return <Table data={tokens.data} />
}

export default Tokens
