import { CoinDataCG } from '@/_api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	coin: CoinDataCG
	chart: { date: string; value: number }[]
}

const initialState: InitialState = {
	coin: {
		id: '',
		description: { en: '' },
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
			price_change_percentage_1y: undefined,
			max_supply: undefined
		}
	},
	chart: []
}

export const CoinCG = createSlice({
	name: 'Coin',
	initialState,
	reducers: {
		setCoinCG: (state, action: PayloadAction<CoinDataCG>) => {
			state.coin = action.payload
		},
		setChart: (state, action: PayloadAction<{ date: string; value: number }[]>) => {
			state.chart = action.payload
		}
	}
})

export const { setCoinCG, setChart } = CoinCG.actions
export default CoinCG.reducer
