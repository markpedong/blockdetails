import { useAppSelector } from '@/_redux/store'
import { DollarOutlined, PieChartOutlined, RadarChartOutlined } from '@ant-design/icons'
import { Col, Segmented } from 'antd'
import React, { FC } from 'react'
import Description from './description'
import dynamic from 'next/dynamic'
import Trending from './trending'

const Line = dynamic(() => import('@ant-design/charts').then(i => i.Line))

const ChartData: FC = () => {
	const data = useAppSelector(state => state.coinCG.chart)
	const lowestValue = data?.reduce((acc, curr) => (curr.value < acc.value ? curr : acc), data[0] || undefined)

	return (
		<Col span={14}>
			<Segmented
				// value={currentTab}
				// onChange={(val: string) => setCurrentTab(val)}
				defaultValue="price"
				size="middle"
				options={[
					{
						label: 'Price',
						value: 'price',
						icon: <DollarOutlined />
					},
					{
						label: 'Market Cap',
						value: 'marketcap',
						icon: <RadarChartOutlined />
					},
					{
						label: 'Volume',
						value: 'volume',
						icon: <PieChartOutlined />
					}
				]}
				style={{ marginBlockEnd: '50px' }}
			/>
			<Line
				data={data}
				yAxis={{ min: lowestValue?.value }}
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
			<Description />
			<Trending />
		</Col>
	)
}

export default ChartData
