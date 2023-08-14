import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type StateData = {
	totalCrypto: number
	totalExchange: number
}

type InitialState = {
	value: StateData
}

const initialState: InitialState = {
	value: {
		totalCrypto: 0,
		totalExchange: 0
	}
}

export const globalData = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setTotal: (_, action: PayloadAction<StateData>) => {
			const { totalCrypto, totalExchange } = action.payload

			return {
				value: { totalCrypto, totalExchange }
			}
		}
	}
})

export const { setTotal } = globalData.actions
export default globalData.reducer
