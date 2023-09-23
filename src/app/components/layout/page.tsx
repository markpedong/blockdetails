'use client'

import logo from '@/assets/logo.svg'
import { Typography, theme } from 'antd'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import enUS from 'antd/locale/en_US'
import menus from './menus'
import Header from '../header/header'
import withTheme from '@/theme'
import { useAppSelector } from '@/redux/store'

const ProLayout = dynamic(() => import('@ant-design/pro-components').then(com => com.ProLayout), { ssr: false })
const ConfigProvider = dynamic(() => import('antd').then(com => com.ConfigProvider))

export default function Layout({ children }: { children: React.ReactNode }) {
	const darkMode = useAppSelector(state => state.global.isDark)
	const [collapsed, setCollapsed] = useState(true)
	const pathname = usePathname()
	const router = useRouter()

	return withTheme({
		darkMode,
		children: (
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: '#52c41a'
					},
					algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
				}}
				locale={enUS}
			>
				<ProLayout
					location={{ pathname }}
					title="Block Details"
					collapsed={collapsed}
					collapsedButtonRender={false}
					layout="mix"
					menuProps={{
						onMouseEnter: () => setTimeout(() => setCollapsed(false), 200),
						onMouseLeave: () => setTimeout(() => setCollapsed(true), 200)
					}}
					headerContentRender={() => <Header />}
					menuDataRender={() => menus}
					menuItemRender={(item, dom) => (
						<Typography.Link onClick={() => router.replace(item.path as string)}>{dom}</Typography.Link>
					)}
					headerTitleRender={() => (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Image src={logo} alt="logo" style={{ width: 30, height: 30 }} />
							<h1>Block Details</h1>
						</div>
					)}
				>
					{children}
				</ProLayout>
			</ConfigProvider>
		)
	})
}
