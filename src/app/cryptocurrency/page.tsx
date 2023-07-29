'use client'

import { Cryptocurrency, fetchCryptocurrency, getCryptocurrency } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Button } from 'antd'

const Cryptocurrency = () => {
	const columns: ProColumns<Cryptocurrency>[] = [
		{
			title: '#',
			render: (_, record) => record.cmc_rank,
			align: 'center'
		},
		{
			title: 'Name',
			render: (_, record) => record.name,
			align: 'left'
		},
		{
			title: 'Price',
			render: (_, record) => record.quote['USD'].price,
			align: 'right'
		},
		{
			title: '1h %',
			render: (_, record) => record.quote['USD'].percent_change_1h,
			align: 'center'
		},
		{
			title: '24 %',
			render: (_, record) => record.quote['USD'].percent_change_24h,
			align: 'center'
		},
		{
			title: '7d %',
			render: (_, record) => record.quote['USD'].percent_change_7d,
			align: 'center'
		},
		{
			title: 'Market Cap',
			render: (_, record) => record.quote['USD'].market_cap,
			align: 'right'
		},
		{
			title: 'Volume(24h)',
			render: (_, record) => record.quote['USD'].volume_24h,
			align: 'right'
		},
		{
			title: 'Circulating Supply',
			render: (_, record) => record.quote['USD'].volume_24h,
			align: 'right'
		}
	]

	const getTableData = async () => {
		const data = await fetchCryptocurrency({
			aux: 'cmc_rank'
		})

		const result = data.data

		return {
			data: result
		}
	}
	return <ProTable {...PRO_TABLE_PROPS} rowKey='id' request={getTableData} columns={columns} search={false} />
}

export default Cryptocurrency
