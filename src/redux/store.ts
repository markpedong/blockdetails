import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import coinCG from './features/coinGSlice'
import coin from './features/coinSlice'
import exchange from './features/exchangeSlice'
import global from './features/globalSlice'
import { globalSliceTest } from './features/testSlice'

type RootType = {
	global: ReturnType<typeof global>
	coin: ReturnType<typeof coin>
	coinCG: ReturnType<typeof coinCG>
	exchange: ReturnType<typeof exchange>
}

const reducer = combineReducers({
	global,
	coin,
	coinCG,
	exchange,
	[globalSliceTest.reducerPath]: globalSliceTest.reducer
})

export const store = configureStore({
	reducer,
	middleware: getDefaultMiddleware => {
		return getDefaultMiddleware({
			serializableCheck: {
				warnAfter: 128
			},
			immutableCheck: { warnAfter: 128 }
		}).concat(globalSliceTest.middleware)
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootType> = useSelector
