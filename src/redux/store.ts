import { combineReducers, configureStore } from '@reduxjs/toolkit'
import themeReducer from './features/themeSlice'
import setCurrency from './features/currencySlice'
import setGlobal from './features/globalSlice'
import setCoin from './features/coinSlice'
import setQuotes from './features/quoteSlice'
import setCoinCG from './features/coinGSlice'
import setCharts from './features/chartSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const persistConfig = {
	key: 'root',
	version: 1,
	storage
}

const reducer = combineReducers({
	themeReducer,
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
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
