import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './features/themeSlice'
import setCurrency from './features/currencySlice'
import setTotal from './features/globalSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const storeTheme = configureStore({
	reducer: {
		themeReducer,
		setCurrency,
		setTotal
	}
})

export type RootState = ReturnType<typeof storeTheme.getState>
export type AppDispatch = typeof storeTheme.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
