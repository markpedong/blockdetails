import { GlobalData } from '@/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	value: GlobalData
}

const initialState: InitialState = {
	value: {
		active_cryptocurrencies: null,
		active_exchanges: null,
		btc_dominance: null,
		btc_dominance_24h_percentage_change: null,
		eth_dominance: null,
		eth_dominance_24h_percentage_change: null,
		quote: {}
	}
}

export const globalData = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setGlobalData: (_, action: PayloadAction<GlobalData>) => {
			return {
				value: action.payload
			}
		}
	}
})

export const { setGlobalData } = globalData.actions
export default globalData.reducer
