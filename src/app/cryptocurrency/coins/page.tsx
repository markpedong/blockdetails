import {
	CoinsItem,
	ExchangeItem,
	TExchange,
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
	const [coins, fiats, defi, global, ids, trending, exchanges, coinsID, exchangeID] = await Promise.all([
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
		getExchangeList() as unknown as ExchangeItem[]
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
		/>
	)
}

export default Coins
