import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	value: {
		totalCrypto: number
	}
}

const initialState: InitialState = {
	value: {
		totalCrypto: 0
	}
}

export const globalCrypto = createSlice({
	name: 'global',
	initialState,
	reducers: {
		getTotalCrypto: (_, action: PayloadAction<number>) => {
			return {
				value: {
					totalCrypto: action.payload
				}
			}
		}
	}
})

export const { getTotalCrypto } = globalCrypto.actions
export default globalCrypto.reducer
