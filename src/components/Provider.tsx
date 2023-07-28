'use client'

import { ConfigProvider, theme } from 'antd'
import enUS from 'antd/locale/en_US'
import React from 'react'

type Props = {
	children: React.ReactNode
	darkMode: boolean
}

const Provider = ({ children, darkMode }: Props) => {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#52c41a'
				},
				algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
			}}
			locale={enUS}
		>
			{children}
		</ConfigProvider>
	)
}

export default Provider
