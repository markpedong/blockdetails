import { combineReducers, configureStore } from '@reduxjs/toolkit'
import global from './features/globalSlice'
import { globalSliceTest } from './features/testSlice'
import coin from './features/coinSlice'
import coinCG from './features/coinGSlice'
import exchange from './features/exchangeSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer, createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { compress, decompress } from 'lz-string'

type RootType = {
	global: ReturnType<typeof global>
	coin: ReturnType<typeof coin>
	coinCG: ReturnType<typeof coinCG>
	exchange: ReturnType<typeof exchange>
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
	global,
	coin,
	coinCG,
	exchange,
	[globalSliceTest.reducerPath]: globalSliceTest.reducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware => {
		return getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		}).concat(globalSliceTest.middleware)
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootType> = useSelector
