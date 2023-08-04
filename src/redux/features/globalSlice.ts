import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type StateData = {
	totalCrypto: number
}
type InitialState = {
	value: StateData
}

const initialState: InitialState = {
	value: {
		totalCrypto: 0
	}
}

export const globalData = createSlice({
	name: 'global',
	initialState,
	reducers: {
		setTotal: (_, action: PayloadAction<number>) => {
			return {
				value: {
					totalCrypto: action.payload
				}
			}
		}
	}
})

export const { setTotal } = globalData.actions
export default globalData.reducer
