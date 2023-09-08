import { CoinData } from '@/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	value: CoinData
}

const initialState: InitialState = {
	value: {
		category: '',
		description: '',
		id: '',
		logo: '',
		name: '',
		slug: '',
		symbol: '',
		urls: {
			explorer: [],
			website: [],
			message_board: [],
			reddit: [],
			source_code: []
		}
	}
}

export const Coin = createSlice({
	name: 'Coin',
	initialState,
	reducers: {
		setCoin: (state, action: PayloadAction<CoinData>) => {
			state.value = action.payload
		}
	}
})

export const { setCoin } = Coin.actions
export default Coin.reducer
