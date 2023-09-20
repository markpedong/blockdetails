'use client'

import { Exchange } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Space } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

type Props = {
	data: Exchange[]
}

const Table: FC<Props> = ({ data }) => {
	const columns: ProColumns<Exchange>[] = [
		{
			title: '#',
			align: 'center',
			render: (_, _1, i) => i + 1
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				console.log(record)
				return (
					<Space align="center">
						<Image src={record.image} alt={`logo${record.id}`} width={25} height={25} />
						<Link href={`/cryptocurrency/${record.name}`}>{record.name}</Link>
					</Space>
				)
			}
		},
		{
			title: 'Volume (24h) IN BTC MUST BE CONVERTED TO USD',
			align: 'center',
			render: (_, record) => record.trade_volume_24h_btc_normalized
		},
		{
			title: 'Volume (24h)',
			align: 'center',
			render: (_, record) => record.trade_volume_24h_btc
		}
	]
	return <ProTable<Exchange> {...PRO_TABLE_PROPS} rowKey="id" columns={columns} search={false} dataSource={data} />
}

export default Table
