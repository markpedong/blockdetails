import { CoinData, CoinIds, CoinsItem, ExchangeItem, GetTrendingResponse, QuoteData, TExchange } from '@/api'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ValuesType } from 'utility-types'

type Trending = ValuesType<GetTrendingResponse['coins']>
type InitialState = {
	coin: CoinData
	coins: CoinData[]
	quote: QuoteData
	ids: CoinIds[]
	exchanges: TExchange[]
	trending: Trending[]
	coinsID: CoinsItem[]
	exchangeID: ExchangeItem[]
}

const initialState: InitialState = {
	coins: [],
	coin: {
		category: '',
		description: '',
		id: '',
		logo: '',
		name: '',
		slug: '',
		symbol: '',
		urls: {
			explorer: [],
			website: [],
			message_board: [],
			reddit: [],
			source_code: []
		}
	},
	quote: { cmc_rank: '', circulating_supply: undefined, max_supply: undefined, total_supply: undefined, quote: {} },
	ids: [],
	exchanges: [],
	trending: [],
	coinsID: [],
	exchangeID: []
}

export const Coin = createSlice({
	name: 'Coin',
	initialState,
	reducers: {
		setCoinArray: (state, action: PayloadAction<CoinData[]>) => {
			state.coins = action.payload
		},
		setCoin: (state, action: PayloadAction<CoinData>) => {
			state.coin = action.payload
		},
		setQuotes: (state, action: PayloadAction<QuoteData>) => {
			state.quote = action.payload
		},
		setGlobalIds: (state, action: PayloadAction<CoinIds[]>) => {
			state.ids = action.payload
		},
		setExchanges: (state, action: PayloadAction<TExchange[]>) => {
			state.exchanges = action.payload
		},
		setTrending: (state, action: PayloadAction<Trending[]>) => {
			state.trending = action.payload
		},
		setCoinsID: (state, action: PayloadAction<CoinsItem[]>) => {
			state.coinsID = action.payload
		},
		setExchangesID: (state, action: PayloadAction<ExchangeItem[]>) => {
			state.exchangeID = action.payload
		}
	}
})

export const getCoins = s => s.coin.coins
export const getBitcoin = s => s.coin.coin
export const getQuotes = s => s.coin.quote
export const getExchangesSlice = s => s.coin.exchanges as TExchange[]
export const getCoinsID = s => s.coin.coinsID as CoinsItem[]
export const getExchangeID = s => s.coin.exchangeID as ExchangeItem[]

export const { setCoin, setCoinArray, setQuotes, setGlobalIds, setExchanges, setTrending, setCoinsID, setExchangesID } =
	Coin.actions
export default Coin.reducer
