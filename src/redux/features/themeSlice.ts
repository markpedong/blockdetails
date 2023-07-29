import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	value: {
		isDark: boolean
	}
}

const initialState: InitialState = {
	value: {
		isDark: false
	}
}

export const theme = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		darkMode: (_, action: PayloadAction<boolean>) => {
			return {
				value: {
					isDark: action.payload
				}
			}
		}
	}
})

export const { darkMode } = theme.actions
export default theme.reducer
