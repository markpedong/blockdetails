'use client'

import { Cryptocurrency, getCryptocurrency } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Button } from 'antd'

const Cryptocurrency = () => {
	const columns: ProColumns<Cryptocurrency>[] = [
		{
			title: '#',
			render: (_, record) => record.cmc_rank
		}
	]

	const getTableData = async () => {
		const data = await getCryptocurrency({
			aux: 'cmc_rank'
		})

		const result = data?.data?.data

		console.log(result)

		return {
			data: result
		}
	}
	return <ProTable {...PRO_TABLE_PROPS} rowKey='id' request={getTableData} columns={columns} />
}

export default Cryptocurrency
