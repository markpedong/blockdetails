import { CoinDataCG } from '@/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	value: CoinDataCG
}

const initialState: InitialState = {
	value: {
		market_data: {
			current_price: {},
			ath: {},
			ath_change_percentage: {},
			ath_date: {},
			atl: {},
			atl_change_percentage: {},
			atl_date: {},
			price_change_24h_in_currency: {},
			price_change_percentage_7d_in_currency: {},
			price_change_percentage_7d: undefined,
			price_change_percentage_30d_in_currency: {},
			price_change_percentage_30d: undefined,
			price_change_percentage_60d_in_currency: {},
			price_change_percentage_60d: undefined,
			price_change_percentage_1y_in_currency: {},
			price_change_percentage_1y: undefined
		}
	}
}

export const CoinCG = createSlice({
	name: 'Coin',
	initialState,
	reducers: {
		setCoinCG: (state, action: PayloadAction<CoinDataCG>) => {
			state.value = action.payload
		}
	}
})

export const { setCoinCG } = CoinCG.actions
export default CoinCG.reducer
