import { getCryptocurrency, getFiats, getGlobalCrypto } from '@/api'
import Table from './table'

const Coins = async () => {
	// LOCALSTORAGE???
	const coins = await getCryptocurrency({
		aux: 'cmc_rank,circulating_supply',
		limit: 5000,
		convert: 'USD',
		cryptocurrency_type: 'coins'
	})
	const global = await getGlobalCrypto()
	const fiats = await getFiats()

	return <Table data={coins.data} global={global.data} fiats={fiats.data} />
}

export default Coins
