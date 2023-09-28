import { getCryptocurrency, getDefi, getFiats, getGlobalCrypto } from '@/api'
import Table from './table'

const Coins = async ({ searchParams: { currency } }) => {
	// LOCALSTORAGE???
	const [coins, fiats, defi, global] = await Promise.all([
		getCryptocurrency({
			aux: 'cmc_rank,circulating_supply',
			limit: 5000,
			convert: currency,
			cryptocurrency_type: 'coins'
		}),
		getFiats(),
		getDefi(),
		getGlobalCrypto({ convert: currency ?? 'USD' })
	])

	return <Table data={coins.data} fiats={fiats.data} defi={defi.data} initGlobal={global.data} />
}

export default Coins
