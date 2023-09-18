'use client'

import React from 'react'
import { ConfigProvider, theme } from 'antd'
import { useAppSelector } from '@/redux/store'
import enUS from 'antd/es/locale/en_US'

const withTheme = (node: React.ReactNode) => {
	const darkTheme = useAppSelector(state => state.themeReducer.value.isDark)

	return (
		<ConfigProvider
			theme={{
				algorithm: darkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
				token: { colorPrimary: 'orange' }
			}}
			locale={enUS}
		>
			{node}
		</ConfigProvider>
	)
}

export default withTheme
