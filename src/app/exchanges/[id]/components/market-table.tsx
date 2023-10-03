import { CGCoinData, TExchangeDetail } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { formatPrice, navigate } from '@/utils'
import { renderPer } from '@/utils/antd'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Button, Col, Space, Typography } from 'antd'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FC } from 'react'
import { ValuesType } from 'utility-types'

type Tickers = ValuesType<TExchangeDetail['tickers']>

type Props = {
	exchange: TExchangeDetail
	cg: CGCoinData[]
}

const MarketTable: FC<Props> = ({ exchange, cg }) => {
	const { sign } = useAppSelector(state => state.global.currency)
	const ids = useAppSelector(state => state.coin.ids)
	const params = useSearchParams()
	const tickers = exchange.tickers
		?.filter((item, index, self) => index === self.findIndex(t => t.coin_id === item.coin_id))
		?.map(item => cg.find(coin => coin.id === item.coin_id))
		?.filter(Boolean)
	const data = tickers?.map(i => {
		const { slug } = ids?.find(q => q.symbol.toLowerCase() === i.symbol.toLowerCase()) ?? { slug: '' }

		return { ...i, ...exchange.tickers.find(q => q.coin_id === i.id), slug }
	})
	const columns: ProColumns<CGCoinData & Tickers & { slug: string }>[] = [
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
						<Typography.Link
							href={navigate(`/cryptocurrency/${record.slug}`, params)}
							disabled={!record.slug}
						>
							{record.name}
						</Typography.Link>
					</Space>
				)
			}
		},
		{
			title: 'Pair',
			align: 'center',
			render: (_, record) => (
				<Typography.Link href={record.trade_url} target="_blank">
					{record.base} / {record.target}
				</Typography.Link>
			)
		},

		{
			title: 'Price',
			align: 'center',
			render: (_, record) => formatPrice(record.current_price, sign)
		},
		{
			title: '24 %',
			align: 'center',
			render: (_, record) => renderPer(record.price_change_percentage_24h)
		},
		{
			title: 'Volume (24h)',
			align: 'center',
			render: (_, record) => formatPrice(record.total_volume, sign)
		},
		{
			title: 'Spread Percentage',
			align: 'center',
			render: (_, record) => record.bid_ask_spread_percentage?.toFixed(2)
		},
		{
			title: 'Trust Score',
			align: 'center',
			render: (_, record) => <Button style={{ backgroundColor: record.trust_score }} />
		}
	]

	return (
		<Col span={24}>
			<Typography.Title level={4}>{exchange.name} Markets:</Typography.Title>
			<ProTable<CGCoinData & Tickers>
				{...PRO_TABLE_PROPS}
				rowKey="id"
				columns={columns}
				search={false}
				dataSource={data}
				pagination={{ pageSize: 6 }}
			/>
		</Col>
	)
}

export default MarketTable
