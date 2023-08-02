'use client'

import { Cryptocurrency, getCryptocurrency } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { numberWithCommas } from '@/utils'
import { renderPercentage } from '@/utils/antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Space, Typography } from 'antd'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const CryptocurrencyTable = () => {
	const actionRef = useRef<ActionType>()
	const { symbol, sign } = useAppSelector(state => state.setCurrency.value)

	const columns: ProColumns<Cryptocurrency>[] = [
		{
			title: '#',
			align: 'center',
			render: (_, record) => record.cmc_rank
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				const src = `https://s2.coinmarketcap.com/static/img/coins/64x64/${record.id}.png`

				return (
					<Space align='center'>
						<Image src={src} alt='logo' width={25} height={25} />
						<Typography.Link>{record.name}</Typography.Link>
					</Space>
				)
			}
		},
		{
			title: 'Price',
			align: 'right',
			render: (_, record) => (
				<div>
					{sign} {numberWithCommas(record.quote[symbol]?.price)}
				</div>
			)
		},
		{
			title: '1h %',
			align: 'center',
			render: (_, record) => renderPercentage(record.quote[symbol]?.percent_change_1h)
		},
		{
			title: '24 %',
			align: 'center',
			render: (_, record) => renderPercentage(record.quote[symbol]?.percent_change_24h)
		},
		{
			title: '7d %',
			align: 'center',
			render: (_, record) => renderPercentage(record.quote[symbol]?.percent_change_7d)
		},
		{
			title: 'Market Cap',
			align: 'right',
			render: (_, record) => (
				<div>
					{sign} {numberWithCommas(record.quote[symbol]?.market_cap)}
				</div>
			)
		},
		{
			title: 'Volume(24h)',
			align: 'right',
			render: (_, record) => (
				<div>
					<div>
						{sign} {numberWithCommas(record.quote[symbol]?.volume_24h)}
					</div>
					{/* <div>{record.}</div> */}
				</div>
			)
		},
		{
			title: 'Circulating Supply',
			align: 'right',
			render: (_, record) => numberWithCommas(record.circulating_supply)
		}
	]

	const getTableData = async (params: any) => {
		const data = await getCryptocurrency({
			aux: 'cmc_rank,circulating_supply',
			limit: 5000,
			convert: symbol
		})

		const result = data.data?.map(crypto => ({
			...crypto
		}))

		return {
			data: result
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
			request={getTableData}
		/>
	)
}

export default CryptocurrencyTable
