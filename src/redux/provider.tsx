'use client'

import { Provider } from 'react-redux'
import { store } from './store'
import React from 'react'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

let persistor = persistStore(store)

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				{/* <ApiProvider api={globalSliceTest}> */}
				{children}
				{/* </ApiProvider> */}
			</PersistGate>
		</Provider>
	)
}
