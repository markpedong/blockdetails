import { QuoteData } from '@/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	value: QuoteData
}

const initialState: InitialState = {
	value: {
		cmc_rank: '',
		circulating_supply: undefined,
		max_supply: undefined,
		total_supply: undefined,
		quote: {}
	}
}

export const Quotes = createSlice({
	name: 'Quotes',
	initialState,
	reducers: {
		setQuotes: (state, action: PayloadAction<QuoteData>) => {
			state.value = action.payload
		}
	}
})

export const { setQuotes } = Quotes.actions
export default Quotes.reducer
