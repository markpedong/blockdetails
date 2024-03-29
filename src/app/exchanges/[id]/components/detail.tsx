'use client'

import { CGCoinData, Cryptocurrency, TExchangeDetail, ExchangePap } from '@/api'
import { useAppSelector } from '@/redux/store'
import { formatPrice } from '@/utils'
import { Col, Flex, Row, Typography } from 'antd'
import Image from 'next/image'
import { FC, memo } from 'react'
import Links from './links'
import MarketData from './market-data'
import MarketTable from './market-table'
import dynamic from 'next/dynamic'
import { getAllCurrency } from '@/redux/features/globalSlice'
import { getCoins } from '@/redux/features/coinSlice'
import { getExchangeDetail } from '@/redux/features/exchangeSlice'

const Line = dynamic(() => import('@ant-design/charts').then(i => i.Line))

type Props = {
	exchange: TExchangeDetail
	id: string
	cg: CGCoinData[]
	pap: ExchangePap[]
	chart: { date: string; value: number }[]
}

const ExchangeDetail: FC<Props> = ({ exchange, id, cg, pap: exchanges, chart }) => {
	const { sign, symbol } = useAppSelector(getAllCurrency)
	const coins = useAppSelector(getCoins)
	const detail = useAppSelector(getExchangeDetail)
	const pap = exchanges?.find(
		paprika =>
			paprika.id === id || paprika.name.split(' ')[0].toLowerCase() === exchange.name?.split(' ')[0].toLowerCase()
	)
	const { quote } = (coins[0] as unknown as Cryptocurrency) ?? {}
	const price = detail?.quotes?.[symbol]?.reported_volume_24h
	const lowestValue = chart?.reduce((acc, curr) => (curr.value < acc.value ? curr : acc), chart[0] || undefined)

	return (
		<Row>
			<Col span={8}>
				<Flex
					justify="start"
					align="center"
					style={{
						gap: '10px',
						paddingBlockEnd: '1rem'
					}}
				>
					<Image src={exchange.image} alt={`${id}`} width={30} height={30} />
					<Typography.Text style={{ fontSize: '2rem', fontWeight: 700 }}>{exchange.name}</Typography.Text>
				</Flex>
				<Links exchange={exchange} pap={pap} />
				{pap && <MarketData exchange={exchange} />}
				<div style={{ marginBlockStart: '3rem' }}>
					<span dangerouslySetInnerHTML={{ __html: detail.description.split('\n')[0] }} />
				</div>
			</Col>

			<Col span={15} offset={1}>
				<div>
					<Typography.Text style={{ fontSize: '1.2rem', fontWeight: 700 }}>Volume(24h)</Typography.Text>
				</div>
				<div>
					<Typography.Title level={2}>
						{formatPrice(
							price ?? quote?.['USD']?.price * exchange.trade_volume_24h_btc_normalized,
							price ? sign : '$'
						)}
					</Typography.Title>
				</div>
				<div style={{ paddingBlockStart: '1rem' }}>
					<Line
						data={chart}
						yAxis={{ min: +lowestValue?.value }}
						xField="date"
						yField="value"
						annotations={[
							// 低于中位数颜色变化
							// MUST FIX THIS, THE LINE MUST BE IN THE MIDDLE
							{
								type: 'regionFilter',
								start: ['min', 'median'],
								end: ['max', '0'],
								color: '#F4664A'
							},
							{
								type: 'text',
								position: ['min', 'median'],
								content: '中位数',
								offsetY: -4,
								style: {
									textBaseline: 'bottom'
								}
							},
							{
								type: 'line',
								start: ['min', 'median'],
								end: ['max', 'median'],
								style: {
									stroke: '#F4664A',
									lineDash: [2, 2]
								}
							}
						]}
					/>
				</div>
			</Col>
			<MarketTable cg={cg} exchange={exchange} />
		</Row>
	)
}

export default memo(ExchangeDetail)
