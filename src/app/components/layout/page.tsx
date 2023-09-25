'use client'

import logo from '@/assets/logo.svg'
import { AppDispatch, useAppSelector } from '@/redux/store'
import withTheme from '@/theme'
import { Typography, theme } from 'antd'
import enUS from 'antd/locale/en_US'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Header from '../header/header'
import menus from './menus'
import { useDispatch } from 'react-redux'
import { setCurrency } from '@/redux/features/globalSlice'

const ProLayout = dynamic(() => import('@ant-design/pro-components').then(com => com.ProLayout), { ssr: false })
const ConfigProvider = dynamic(() => import('antd').then(com => com.ConfigProvider))

const Layout = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useDispatch<AppDispatch>()
	const darkMode = useAppSelector(state => state.global.isDark)
	const [collapsed, setCollapsed] = useState(true)
	const pathname = usePathname()
	const params = useSearchParams()
	const navigate = useRouter()
	const fiats = useAppSelector(state => state.global.fiats)
	const { sign, symbol } = useAppSelector(state => state.global.currency)
	const getHeader = () => <Header />

	useEffect(() => {
		getHeader()
	}, [sign, symbol])

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
					headerContentRender={getHeader}
					menuDataRender={() => menus}
					menuItemRender={(item, dom) => {
						return (
							<Link
								onClick={() => {
									const { sign, symbol } = fiats.find(fiat => fiat.symbol === params.get('currency'))
									dispatch(setCurrency({ sign, symbol }))

									navigate.refresh()
								}}
								href={item.path + `?${params.toString()}`}
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

export default Layout
