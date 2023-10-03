import { getCryptocurrency } from '@/_api'
import Table from './components/table'

const Tokens = async ({ searchParams: { currency } }: { searchParams?: { currency?: string } }) => {
	const tokens = await getCryptocurrency({
		aux: 'cmc_rank,circulating_supply',
		limit: 5000,
		convert: currency,
		cryptocurrency_type: 'tokens'
	})

	return <Table data={tokens.data} />
}

export default Tokens
