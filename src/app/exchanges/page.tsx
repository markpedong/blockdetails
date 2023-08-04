'use client'

import { Exchange, getExchanges } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { numberWithCommas } from '@/utils'
import { renderScore } from '@/utils/antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Space, Typography } from 'antd'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export const Exchanges = () => {
	const actionRef = useRef<ActionType>()
	const { symbol, sign } = useAppSelector(state => state.setCurrency.value)

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
					<Space align='center'>
						<Image src={record.image} alt='logo' width={25} height={25} />
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
			align: 'right'
			// render: (_, record) => record.traffic_score
		},
		{
			title: '# Markets',
			align: 'right'
			// render: (_, record) => record.num_market_pairs
		},
		{
			title: 'Fiat Supported',
			align: 'center',
			render: (_, record) => {
				// const firstThree = record.fiats.slice(0, 3).map(item => `${item}, `)
				// const fourthLength = record.fiats.slice(3).length

				return (
					<Space direction='vertical' align='start'>
						{/* <Typography.Text strong>{firstThree}</Typography.Text>
						<div style={{ color: 'gray' }}>
							and +{fourthLength} more. <ExclamationCircleTwoTone twoToneColor='gray' />
						</div> */}
					</Space>
				)
			}
		}
	]

	const getTableData = async () => {
		const data = await getExchanges({})

		// const result = data.data?.map(exchange => ({
		// 	...exchange
		// }))

		return {
			// data: result
		}
	}

	useEffect(() => {
		// Whenever 'symbol' changes, ProTable will fetch new data using the 'request' prop.
		// The 'actionRef' is used to trigger reload when necessary.
		if (actionRef.current) {
			actionRef.current.reload()
		}
	}, [symbol])

	return (
		<ProTable
			{...PRO_TABLE_PROPS}
			actionRef={actionRef}
			rowKey='id'
			columns={columns}
			search={false}
			// request={getTableData}
		/>
	)
}

export default Exchanges
