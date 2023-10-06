import { ExchangePap, TExchange } from '@/api'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type InitialState = {
	detail: TExchange & ExchangePap
}

const initialState: InitialState = {
	detail: {
		country: '',
		confidence_score: undefined,
		currencies: undefined,
		fiats: [],
		quotes: {},
		reported_rank: undefined,
		description: '',
		id: '',
		image: '',
		name: '',
		markets: undefined,
		sessions_per_month: undefined,
		trade_volume_24h_btc_normalized: undefined,
		trade_volume_24h_btc: undefined,
		trust_score_rank: undefined,
		trust_score: undefined,
		url: '',
		year_established: undefined
	}
}

export const Exchange = createSlice({
	name: 'Exchange',
	initialState,
	reducers: {
		setExchangeDetail: (state, action: PayloadAction<TExchange & ExchangePap>) => {
			state.detail = action.payload
		}
	}
})

export const { setExchangeDetail } = Exchange.actions
export default Exchange.reducer
