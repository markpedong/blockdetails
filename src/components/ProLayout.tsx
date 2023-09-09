'use client'

import logoDark from '@/assets/logo-darkmode.svg'
import logo from '@/assets/logo.svg'
import GlobalData from '@/components/GlobalData/GlobalData'
import Provider from '@/components/Provider'
import menus from '@/menus'
import { useAppSelector } from '@/redux/store'
import { Typography, theme } from 'antd'
import enUS from 'antd/locale/en_US'
import { cloneDeep } from 'lodash'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const ProLayout = dynamic(() => import('@ant-design/pro-layout').then(com => com.ProLayout), { ssr: false })

const ConfigProvider = dynamic(() => import('antd').then(com => com.ConfigProvider))

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const navigate = useRouter()
	const [collapsed, setCollapsed] = useState(true)
	const darkMode = useAppSelector(state => state.themeReducer.value.isDark)

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
			<Provider darkMode={darkMode}>
				<ProLayout
					location={{ pathname }}
					title="Block Details"
					fixedHeader
					collapsed={collapsed}
					collapsedButtonRender={false}
					route={{ routes: cloneDeep(menus) }}
					layout="mix"
					headerContentRender={() => <GlobalData />}
					menuProps={{
						onMouseEnter: () => setTimeout(() => setCollapsed(false), 200),
						onMouseLeave: () => setTimeout(() => setCollapsed(true), 200)
					}}
					headerTitleRender={() => (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Image src={darkMode ? logoDark : logo} alt="logo" style={{ width: 30, height: 30 }} />
							<h1>Block Details</h1>
						</div>
					)}
					menuItemRender={(item, dom) => {
						return (
							<Typography.Link
								style={{ paddingBlockStart: '0.5rem' }}
								onClick={() => navigate.replace(item.path as string)}
							>
								{dom}
							</Typography.Link>
						)
					}}
				>
					{children}
				</ProLayout>
			</Provider>
		</ConfigProvider>
	)
}
