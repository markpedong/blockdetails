import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type StateData = {
	sign: string
	symbol: string
}
type InitialState = {
	value: StateData
}

const initialState: InitialState = {
	value: {
		sign: '$',
		symbol: 'USD'
	}
}

export const globalCurrency = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		setCurrency: (state, action: PayloadAction<StateData>) => {
			state.value = action.payload
		}
	}
})

export const { setCurrency } = globalCurrency.actions
export default globalCurrency.reducer
