import { getCoinIds, getCryptocurrency, getDefi, getFiats, getGlobalCrypto, getTrending } from '@/api'
import Table from './table'

const Coins = async ({ searchParams: { currency } }: { searchParams?: { currency?: string } }) => {
	const [coins, fiats, defi, global, ids, trending] = await Promise.all([
		getCryptocurrency({
			aux: 'cmc_rank,circulating_supply',
			limit: 5000,
			convert: currency,
			cryptocurrency_type: 'coins'
		}),
		getFiats(),
		getDefi(),
		getGlobalCrypto({ convert: currency ?? 'USD' }),
		getCoinIds({ limit: 5000 }),
		getTrending()
	])

	return (
		<Table
			data={coins.data}
			fiats={fiats.data}
			defi={defi.data}
			initGlobal={global.data}
			ids={ids.data}
			trending={trending.coins}
		/>
	)
}

export default Coins
