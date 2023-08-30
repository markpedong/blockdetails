'use client'

import { Exchange, getExchanges, getExchangesPaprika } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { numberWithCommas } from '@/utils'
import { renderScore } from '@/utils/antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Space, Typography } from 'antd'
import Image from 'next/image'
import React, { FC, useEffect, useRef } from 'react'

const Exchanges: FC = () => {
	const actionRef = useRef<ActionType>()
	const { symbol } = useAppSelector(state => state.setCurrency.value)
	const { totalCrypto, totalExchange } = useAppSelector(state => state.setTotal.value)

	const columns: ProColumns<Exchange>[] = [
		{
			title: '#',
			align: 'center',
			render: (_, record) => record.trust_score_rank
		},
		{
			title: 'Exchange',
			align: 'left',
			render: (_, record) => {
				return (
					<Space align="center">
						<Image unoptimized src={record.image} alt="logo" width={25} height={25} />
						<Typography.Link>{record.name}</Typography.Link>
					</Space>
				)
			}
		},
		{
			title: 'Score',
			align: 'right',
			render: (_, record) => renderScore(record.trust_score)
		},
		{
			title: '24h Volume (Normalized)',
			align: 'right',
			render: (_, record) => <div>฿ {numberWithCommas(record.trade_volume_24h_btc_normalized)}</div>
		},
		{
			title: '24h Volume',
			align: 'right',
			render: (_, record) => <div>฿ {numberWithCommas(record.trade_volume_24h_btc)}</div>
		},
		{
			title: 'Monthly Visits',
			align: 'right',
			dataIndex: 'sessions_per_month',
			render: (_, record) => numberWithCommas(record.sessions_per_month) || '-'
		},
		{
			title: '# Markets',
			align: 'right',
			render: (_, record) => numberWithCommas(record.markets) || '-'
		},
		{
			title: 'Fiat Supported',
			align: 'center',
			render: (_, record) => {
				const fiats = record.fiats?.slice(0, 3).map(item => `${item.symbol}, `)
				const length = record.fiats?.slice(3)?.length

				return record.fiats?.length ? (
					<Space direction="vertical" align="start">
						<Typography.Text strong>{fiats}</Typography.Text>
						{length > 1 && (
							<div style={{ color: 'gray' }}>
								and +{length} more. <ExclamationCircleTwoTone twoToneColor="gray" />
							</div>
						)}
					</Space>
				) : (
					'-'
				)
			}
		}
	]

	const getTableData = async () => {
		const data = (await getExchanges({})) as unknown as Exchange[]
		const data2 = await getExchangesPaprika({})

		const mergedArray = data.map(item1 => ({
			...item1,
			...(data2.find(item2 => item2.id === item1.id) || {})
		}))

		console.log(mergedArray)

		return {
			data: mergedArray
		}
	}

	console.log(totalCrypto, totalExchange)

	useEffect(() => {
		// Whenever 'symbol' changes, ProTable will fetch new data using the 'request' prop.
		// The 'actionRef' is used to trigger reload when necessary.
		if (actionRef.current) {
			actionRef.current.reload()
		}
	}, [symbol])

	return (
		<ProTable<Exchange>
			{...PRO_TABLE_PROPS}
			actionRef={actionRef}
			rowKey="id"
			columns={columns}
			search={false}
			request={getTableData}
		/>
	)
}

export default Exchanges