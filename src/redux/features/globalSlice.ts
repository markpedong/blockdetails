import { GlobalData } from '@/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	value: GlobalData
}

const initialState: InitialState = {
	value: {
		active_cryptocurrencies: 0,
		active_exchanges: 0,
		btc_dominance: 0,
		btc_dominance_24h_percentage_change: 0,
		eth_dominance: 0,
		eth_dominance_24h_percentage_change: 0,
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
