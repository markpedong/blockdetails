import { getCryptocurrency } from '@/api'
import Table from './components/table/page'

const Tokens = async ({ searchParams: { currency } }) => {
	const tokens = await getCryptocurrency({
		aux: 'cmc_rank,circulating_supply',
		limit: 5000,
		convert: currency,
		cryptocurrency_type: 'tokens'
	})

	return <Table data={tokens.data} />
}

export default Tokens
