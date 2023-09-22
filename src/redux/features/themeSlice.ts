import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	isDark: boolean
}

const initialState: InitialState = {
	isDark: false
}

export const theme = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setTheme: (_, action: PayloadAction<boolean>) => {
			return {
				isDark: action.payload
			}
		}
	}
})

export const { setTheme } = theme.actions
export default theme.reducer
