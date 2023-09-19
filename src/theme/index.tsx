'use client'

import React, { FC } from 'react'
import { ConfigProvider, theme } from 'antd'
import enUS from 'antd/es/locale/en_US'

type Props = {
	darkMode: boolean
	children: React.ReactNode
}

const withTheme: FC<Props> = ({ children, darkMode }) => {
	return (
		<ConfigProvider
			theme={{
				algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
			}}
			locale={enUS}
		>
			{children}
		</ConfigProvider>
	)
}

export default withTheme
