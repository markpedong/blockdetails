'use client'

import { Provider } from 'react-redux'
import { storeTheme } from './store'
import React from 'react'

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
	return <Provider store={storeTheme}>{children}</Provider>
}
