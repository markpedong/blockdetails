import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	value: { date: string; value: number }[]
}

const initialState: InitialState = {
	value: []
}

export const Chart = createSlice({
	name: 'Chart',
	initialState,
	reducers: {
		setChart: (state, action: PayloadAction<{ date: string; value: number }[]>) => {
			state.value = action.payload
		}
	}
})

export const { setChart } = Chart.actions
export default Chart.reducer
