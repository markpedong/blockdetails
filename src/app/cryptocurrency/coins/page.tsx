import { getCoinIds, getCryptocurrency, getDefi, getFiats, getGlobalCrypto } from '@/api'
import Table from './table'

const Coins = async ({ searchParams: { currency } }: { searchParams?: { currency?: string } }) => {
	const [coins, fiats, defi, global, ids] = await Promise.all([
		getCryptocurrency({
			aux: 'cmc_rank,circulating_supply',
			limit: 5000,
			convert: currency,
			cryptocurrency_type: 'coins'
		}),
		getFiats(),
		getDefi(),
		getGlobalCrypto({ convert: currency ?? 'USD' }),
		getCoinIds({ limit: 5000 })
	])

	return <Table data={coins.data} fiats={fiats.data} defi={defi.data} initGlobal={global.data} ids={ids.data} />
}

export default Coins
