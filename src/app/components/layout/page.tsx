'use client'

import logo from '@/assets/logo.svg'
import { Typography } from 'antd'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import enUS from 'antd/locale/en_US'
import menus from './menus'

const ProLayout = dynamic(() => import('@ant-design/pro-components').then(com => com.ProLayout), { ssr: false })
const ConfigProvider = dynamic(() => import('antd').then(com => com.ConfigProvider))

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const [collapsed, setCollapsed] = useState(true)

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#52c41a'
				}
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
				headerContentRender={() => <>omega</>}
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
				menuDataRender={() => menus}
				menuItemRender={(item, dom) => {
					return (
						<Typography.Link style={{ paddingBlockStart: '0.5rem' }}>
							<Link href={item.path as string}>{dom}</Link>
						</Typography.Link>
					)
				}}
			>
				{children}
			</ProLayout>
		</ConfigProvider>
	)
}
