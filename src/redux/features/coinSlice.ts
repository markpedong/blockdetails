import { CoinData, CoinIds, ExchangePap, GetTrendingResponse, QuoteData } from '@/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ValuesType } from 'utility-types'

type Trending = ValuesType<GetTrendingResponse['coins']>
type InitialState = {
	coin: CoinData
	coins: CoinData[]
	quote: QuoteData
	ids: CoinIds[]
	exchanges: ExchangePap[]
	trending: Trending[]
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
	trending: []
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
		setExchanges: (state, action: PayloadAction<ExchangePap[]>) => {
			state.exchanges = action.payload
		},
		setTrending: (state, action: PayloadAction<Trending[]>) => {
			state.trending = action.payload
		}
	}
})

export const getCoins = s => s.coin.coins
export const getBitcoin = s => s.coin.coin
export const getQuotes = s => s.coin.quote
export const getExchangesSlice = s => s.coin.exchanges

export const { setCoin, setCoinArray, setQuotes, setGlobalIds, setExchanges, setTrending } = Coin.actions
export default Coin.reducer
