import { CoinMarketResponse, getCoinMarkets } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Space, Typography } from 'antd'
import Image from 'next/image'
import React, { FC, useEffect, useRef } from 'react'
import { ValuesType } from 'utility-types'

type TableListItem = ValuesType<CoinMarketResponse['tickers']>

const Markets: FC = () => {
	const actionRef = useRef<ActionType>()
	const { symbol } = useAppSelector(state => state.setCurrency.value)
	const coin = useAppSelector(state => state.setCoin.value)
	const columns: ProColumns<TableListItem>[] = [
		{
			title: 'Exchange',
			render: (_, record) => (
				<Space align="center">
					<Image src={record.market.logo} alt={`logo${record.market.name}`} width={25} height={25} />
					<Typography.Link>{record.market.name}</Typography.Link>
				</Space>
			)
		}
	]

	const getTableData = async params => {
		const data = await getCoinMarkets(
			{
				include_exchange_logo: true,
				page: params.current,
				order: 'volume_desc',
				depth: true
			},
			// BUG
			'bitcoin'
		)

		return {
			data: data.tickers
		}
	}

	useEffect(() => {
		if (actionRef.current) {
			actionRef.current?.reload()
		}
	}, [symbol])

	return (
		<div style={{ marginBlockStart: '2rem' }}>
			<Typography.Title level={4}>{coin.name}</Typography.Title>
			<ProTable<TableListItem>
				{...PRO_TABLE_PROPS}
				actionRef={actionRef}
				rowKey="id"
				columns={columns}
				search={false}
				request={getTableData}
			/>
		</div>
	)
}

export default Markets
