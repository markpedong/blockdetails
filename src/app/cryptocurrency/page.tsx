'use client'

import { Cryptocurrency, getCryptocurrency } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { renderPercentage } from '@/utils/antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Space, Tag, Typography } from 'antd'
import Image from 'next/image'

const Cryptocurrency = () => {
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
						<Image loader={() => src} src={src} alt='logo' width={25} height={25} />
						<Typography.Link>{record.name}</Typography.Link>
					</Space>
				)
			}
		},
		{
			title: 'Price',
			align: 'right',
			render: (_, record) => record.quote['USD'].price
		},
		{
			title: '1h %',
			align: 'center',
			render: (_, record) => renderPercentage(record.quote['USD'].percent_change_1h)
		},
		{
			title: '24 %',
			align: 'center',
			render: (_, record) => renderPercentage(record.quote['USD'].percent_change_24h)
		},
		{
			title: '7d %',
			align: 'center',
			render: (_, record) => renderPercentage(record.quote['USD'].percent_change_7d)
		},
		{
			title: 'Market Cap',
			align: 'right',
			render: (_, record) => record.quote['USD'].market_cap
		},
		{
			title: 'Volume(24h)',
			align: 'right',
			render: (_, record) => record.quote['USD'].volume_24h
		},
		{
			title: 'Circulating Supply',
			align: 'right',
			render: (_, record) => record.quote['USD'].volume_24h
		}
	]

	const totalCrypto = useAppSelector(state => state.globalReducer.value.totalCrypto)

	const getTableData = async params => {
		const data = await getCryptocurrency({
			aux: 'cmc_rank',
			start: params.current,
			limit: 5000
		})

		const result = data.data?.map(crypto => ({
			...crypto
		}))

		return {
			data: result
			// total: data.status.total_count
		}
	}
	return <ProTable {...PRO_TABLE_PROPS} rowKey='id' request={getTableData} columns={columns} search={false} />
}

export default Cryptocurrency
