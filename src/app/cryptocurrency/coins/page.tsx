import {
	ExchangePap,
	getCoinIds,
	getCryptocurrency,
	getDefi,
	getExchangesPaprika,
	getFiats,
	getGlobalCrypto,
	getTrending
} from '@/api'
import Table from './table'

const Coins = async ({ searchParams: { currency } }: { searchParams?: { currency?: string } }) => {
	const [coins, fiats, defi, global, ids, trending, exchanges] = await Promise.all([
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
		getTrending(),
		getExchangesPaprika({ quotes: currency ?? 'USD' }) as unknown as ExchangePap[]
	])

	return (
		<Table
			data={coins.data}
			fiats={fiats.data}
			defi={defi.data}
			initGlobal={global.data}
			ids={ids.data}
			trending={trending.coins}
			exchanges={exchanges}
		/>
	)
}

export default Coins
