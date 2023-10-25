'use client'

import { Cryptocurrency, TExchange, ExchangePap } from '@/api'
import { PRO_TABLE_PROPS } from '@/constants'
import { getCoins } from '@/redux/features/coinSlice'
import { setExchangeDetail } from '@/redux/features/exchangeSlice'
import { getAllCurrency } from '@/redux/features/globalSlice'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { formatPrice, navigate } from '@/utils'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Popover, Progress, Space, Typography } from 'antd'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FC, memo } from 'react'
import { useDispatch } from 'react-redux'

type Props = {
	data: TExchange[]
	pap: ExchangePap[]
}

const Table: FC<Props> = ({ data: x, pap }) => {
	const dispatch = useDispatch<AppDispatch>()
	const params = useSearchParams()
	const { sign, symbol } = useAppSelector(getAllCurrency)
	const coins = useAppSelector(getCoins)
	const data = x.map(i => ({ ...i, ...pap.find(q => q.name === i.name || q.id === i.id), id: i.id }))
	const { quote } = (coins[0] as unknown as Cryptocurrency) ?? {}
	const columns: ProColumns<TExchange & ExchangePap>[] = [
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
					<Popover
						title={
							record.description && (
								<div style={{ inlineSize: 300 }}>
									<span dangerouslySetInnerHTML={{ __html: record.description.split('\n')[0] }} />
								</div>
							)
						}
					>
						<Space align="center">
							<Image src={record.image} alt={`logo${record.id}`} width={25} height={25} />
							<Typography.Link
								href={navigate(`/exchanges/${record.id}`, params)}
								onClick={() => {
									dispatch(setExchangeDetail(record))
								}}
							>
								{record.name}
							</Typography.Link>
						</Space>
					</Popover>
				)
			}
		},
		{
			title: 'Markets',
			align: 'center',
			render: (_, record) => record.markets ?? '-'
		},
		{
			title: (
				<>
					<div>Volume (24h)</div>
					<div>Volume (30d)</div>
				</>
			),
			align: 'center',
			render: (_, record) => {
				const price = record.quotes?.[symbol]?.reported_volume_24h
				const price30 = record.quotes?.[symbol]?.reported_volume_30d

				return (
					<>
						<div>
							{formatPrice(
								price ?? quote?.['USD']?.price * record.trade_volume_24h_btc_normalized,
								price ? sign : '$'
							)}
						</div>
						<div>{price30 ? formatPrice(price30, sign) : '-'}</div>
					</>
				)
			}
		},
		{
			title: 'Sessions / Month',
			align: 'center',
			render: (_, record) => formatPrice(record.sessions_per_month, '') ?? '-'
		},
		{
			title: 'Fiats',
			align: 'center',
			render: (_, record) => {
				const fiats = record.fiats
				return (
					<Space direction="vertical">
						<Typography.Text strong>
							{fiats?.slice(0, 3).map(fiat => (
								<span key={fiat.name}>{fiat.symbol}, </span>
							))}
							{(!fiats || fiats.length < 1) && '-'}
						</Typography.Text>
						{fiats?.length > 3 && <span>and +{fiats.slice(3).length} more</span>}
					</Space>
				)
			}
		},
		{
			title: 'Trust Score',
			align: 'center',
			render: (_, record) => (
				<div>
					<Progress percent={record.trust_score * 10} showInfo={false} size={[30, 15]} />
					{record.trust_score}
				</div>
			)
		}
	]

	return <ProTable<TExchange> {...PRO_TABLE_PROPS} rowKey="id" columns={columns} search={false} dataSource={data} />
}

export default memo(Table)
