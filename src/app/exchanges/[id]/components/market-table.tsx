import { CGCoinData, ExchangeDetail } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Col, Space, Typography } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

type Props = {
	exchange: ExchangeDetail
	cg: CGCoinData[]
}

const MarketTable: FC<Props> = ({ exchange, cg }) => {
	const router = useRouter()
	const data = exchange.tickers
		.filter((item, index, self) => index === self.findIndex(t => t.coin_id === item.coin_id))
		.map(item => cg.find(coin => coin.id === item.coin_id))
		.filter(Boolean)

	const columns: ProColumns<CGCoinData>[] = [
		{
			title: '#',
			align: 'center',
			render: (_, _1, i) => i + 1
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				return (
					<Space align="center">
						<Image src={record.image} alt={record.id} width={25} height={25} />
						{/* MATCHED THE ID WITH THE LIST OF IDS FROM CMC AND NAVIGATE IT  */}
						<Typography.Link onClick={() => router.push(`/exchanges/${record.id}`)}>
							{record.name}
						</Typography.Link>
					</Space>
				)
			}
		}
		// {
		// 	title: 'Pair',
		// 	align: 'center',
		// 	render: (_, record) => (
		// 		<Typography.Link href={record.trade_url} target="_blank">
		// 			{record.base} / {record.target}
		// 		</Typography.Link>
		// 	)
		// },
		// {
		// 	title: 'Spread Percentage',
		// 	align: 'center',
		// 	render: (_, record) => record.bid_ask_spread_percentage.toFixed(2)
		// },
		// {
		// 	title: 'Price',
		// 	align: 'center',
		// 	render: (_, record) => formatPrice(record.last)
		// },
		// {
		// 	title: 'Volume (24h)',
		// 	align: 'center',
		// 	render: (_, record) => formatPrice(record.volume, '$')
		// },
		// {
		// 	title: 'Trust Score',
		// 	align: 'center',
		// 	render: (_, record) => <Button style={{ backgroundColor: record.trust_score }} />
		// }
	]

	return (
		<Col span={24}>
			<Typography.Title level={4}>{exchange.name} Markets:</Typography.Title>
			{
				// CHILDREN BUG
			}
			<ProTable<CGCoinData> {...PRO_TABLE_PROPS} rowKey="id" columns={columns} search={false} dataSource={data} />
		</Col>
	)
}

export default MarketTable
