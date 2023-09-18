import { getCryptocurrency, getGlobalCrypto } from '@/api'
import Table from './components/table/page'

const Coins = async () => {
	// LOCALSTORAGE???
	const coins = await getCryptocurrency({
		aux: 'cmc_rank,circulating_supply',
		limit: 5000,
		convert: 'USD',
		cryptocurrency_type: 'coins'
	})
	const global = await getGlobalCrypto()

	return <Table data={coins.data} global={global.data} />
}

export default Coins
