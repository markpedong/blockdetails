'use client'

import { CoinData, getCryptoDetail } from '@/api'
import { Col, Row, Space, Spin, Typography } from 'antd'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

const Detail: FC = ({ params }: { params: any }) => {
	const [coin, setCoin] = useState<CoinData>()

	const initData = async () => {
		const data = await getCryptoDetail(params.slug, {
			localization: true,
			market_data: true,
			community_data: false,
			developer_data: true,
			sparkline: true
		})

		setCoin(data as unknown as CoinData)
	}

	useEffect(() => {
		initData()
	}, [params.slug])

	return (
		<div>
			{coin?.name ? (
				<Row>
					<Col span={6}>
						<Space>
							<Image src={coin?.image?.large} alt={`${coin?.name}`} width={30} height={30} />
							<Typography.Title level={2}>{coin?.name}</Typography.Title>
						</Space>
					</Col>
					<Col span={12}>1</Col>
					<Col span={6}>1</Col>
				</Row>
			) : (
				<Spin size="large" />
			)}
		</div>
	)
}

export default Detail
