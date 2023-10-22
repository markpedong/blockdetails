'use client'

import logo from '@/assets/logo.svg'
import { GLOBAL_STATE, getAllFiats, setCurrency, toggleTheme } from '@/redux/features/globalSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import withTheme from '@/theme'
import { theme } from 'antd'
import enUS from 'antd/locale/en_US'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Header from '../header'
import menus from './menus'
import Link from 'next/link'
import { navigate } from '@/utils'

const ProLayout = dynamic(() => import('@ant-design/pro-components').then(com => com.ProLayout), { ssr: false })
const ConfigProvider = dynamic(() => import('antd').then(com => com.ConfigProvider))

const Layout = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useDispatch<AppDispatch>()
	const darkMode = useAppSelector(toggleTheme)
	const [collapsed, setCollapsed] = useState(true)
	const pathname = usePathname()
	const params = useSearchParams()
	const fiats = useAppSelector(getAllFiats)

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
					menuItemRender={(item, dom) => {
						return (
							<Link
								onClick={() => {
									const { sign, symbol } =
										fiats.find(fiat => fiat.symbol === params.get('currency')) ??
										GLOBAL_STATE.currency

									dispatch(setCurrency({ sign, symbol }))
								}}
								href={navigate(item.path, params)}
							>
								{dom}
							</Link>
						)
					}}
					headerTitleRender={() => (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Image src={logo} alt="logo" style={{ width: 30, height: 30 }} />
							<h1>
								<Link href={navigate('/')} style={{ color: 'black' }}>
									Block Details
								</Link>
							</h1>
						</div>
					)}
				>
					{children}
				</ProLayout>
			</ConfigProvider>
		)
	})
}

export default Layout
