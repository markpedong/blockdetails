import { GlobalData } from '@/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	value: GlobalData
	isDark: boolean
	currency: {
		sign: string
		symbol: string
	}
}

const initialState: InitialState = {
	value: {
		active_cryptocurrencies: null,
		active_exchanges: null,
		btc_dominance: null,
		btc_dominance_24h_percentage_change: null,
		eth_dominance: null,
		eth_dominance_24h_percentage_change: null,
		quote: {},
		defi_volume_24h_reported: null,
		defi_24h_percentage_change: null
	},
	isDark: false,
	currency: {
		sign: '$',
		symbol: 'USD'
	}
}

export const globalData = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setGlobalData: (state, action: PayloadAction<GlobalData>) => {
			state.value = action.payload
		},
		toggleDarkMode: state => {
			state.isDark = !state.isDark
		},
		setCurrency: (state, action: PayloadAction<{ sign: string; symbol: string }>) => {
			state.currency = action.payload
		}
	}
})

export const { setGlobalData, toggleDarkMode, setCurrency } = globalData.actions
export default globalData.reducer
