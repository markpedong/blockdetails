import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './features/themeSlice'
import setCurrency from './features/currencySlice'
import setGlobal from './features/globalSlice'
import setCoin from './features/coinSlice'
import setQuotes from './features/quoteSlice'
import setCoinCG from './features/coinGSlice'
import setCharts from './features/chartSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const storeTheme = configureStore({
	reducer: {
		themeReducer,
		setCurrency,
		setGlobal,
		setCoin,
		setQuotes,
		setCoinCG,
		setCharts
	}
})

export type RootState = ReturnType<typeof storeTheme.getState>
export type AppDispatch = typeof storeTheme.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
