import { Fiat, GlobalData } from '@/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const GLOBAL_STATE = {
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
	},
	fiats: [],
	fiatsCG: []
}

export const globalData = createSlice({
	name: 'global',
	initialState: GLOBAL_STATE,
	reducers: {
		setGlobalData: (state, action: PayloadAction<GlobalData>) => {
			state.value = action.payload
		},
		toggleDarkMode: state => {
			state.isDark = !state.isDark
		},
		setCurrency: (state, action: PayloadAction<{ sign: string; symbol: string }>) => {
			state.currency = action.payload
		},
		getFiatsArray: (state, action: PayloadAction<Fiat[]>) => {
			state.fiats = action.payload
		},
		setFiatsCG: (state, action: PayloadAction<String[]>) => {
			state.fiatsCG = action.payload
		}
	}
})

export const toggleTheme = s => s.global.isDark
export const getGlobal = s => s.global.value
export const getAllFiats = s => s.global.fiats
export const getAllCurrency = s => s.global.currency
export const getAllFiatsCG = s => s.global.fiatsCG

export const { setGlobalData, toggleDarkMode, setCurrency, getFiatsArray, setFiatsCG } = globalData.actions
export default globalData.reducer
