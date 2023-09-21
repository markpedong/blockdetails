import { combineReducers, configureStore } from '@reduxjs/toolkit'
import setTheme from './features/themeSlice'
import setCurrency from './features/currencySlice'
import setGlobal from './features/globalSlice'
import setCoin from './features/coinSlice'
import setQuotes from './features/quoteSlice'
import setCoinCG from './features/coinGSlice'
import setCharts from './features/chartSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer, createTransform } from 'redux-persist'
import { compress, decompress } from 'lz-string'

type RootType = {
	setTheme: ReturnType<typeof setTheme>
	setCurrency: ReturnType<typeof setCurrency>
	setGlobal: ReturnType<typeof setGlobal>
	setCoin: ReturnType<typeof setCoin>
	setQuotes: ReturnType<typeof setQuotes>
	setCoinCG: ReturnType<typeof setCoinCG>
	setCharts: ReturnType<typeof setCharts>
}

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
	transforms: [
		createTransform(
			i => compress(JSON.stringify(i)),
			o => JSON.parse(decompress(o))
		)
	]
}

const reducer = combineReducers({
	setTheme,
	setCurrency,
	setGlobal,
	setCoin,
	setQuotes,
	setCoinCG,
	setCharts
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
	reducer: persistedReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootType> = useSelector
