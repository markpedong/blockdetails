import {
	CoinsItem,
	ExchangeItem,
	TExchange,
	getCGFiats,
	getCoinIds,
	getCoinsList,
	getCryptocurrency,
	getDefi,
	getExchangeList,
	getExchanges,
	getFiats,
	getGlobalCrypto,
	getTrending
} from '@/api'
import Table from './table'

const Coins = async ({ searchParams: { currency } }: { searchParams?: { currency?: string } }) => {
	const [coins, fiats, defi, global, ids, trending, exchanges, coinsID, exchangeID, cgFiats] = await Promise.all([
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
		getExchanges({ per_page: 250 }) as unknown as TExchange[],
		getCoinsList() as unknown as CoinsItem[],
		getExchangeList() as unknown as ExchangeItem[],
		getCGFiats() as unknown as String[]
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
			coinsID={coinsID}
			exchangeID={exchangeID}
			fiatsCG={cgFiats}
		/>
	)
}

export default Coins
