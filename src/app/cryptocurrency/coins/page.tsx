import { getCryptocurrency, getDefi, getFiats } from '@/api'
import Table from './table'

const Coins = async ({ searchParams: { currency } }) => {
	// LOCALSTORAGE???
	const coins = await getCryptocurrency({
		aux: 'cmc_rank,circulating_supply',
		limit: 5000,
		convert: currency,
		cryptocurrency_type: 'coins'
	})
	const fiats = await getFiats()
	const defi = await getDefi()

	return <Table data={coins.data} fiats={fiats.data} defi={defi} />
}

export default Coins
