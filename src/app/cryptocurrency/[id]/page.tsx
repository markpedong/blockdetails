'use client'

import { CoinData, getDetail } from '@/api'
import { Col, Row, Space, Spin, Typography } from 'antd'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

const Detail: FC = ({ params }: { params: any }) => {
	const [coin, setCoin] = useState<CoinData>()

	const initData = async () => {
		const data = await getDetail({
			id: params.id
		})

		setCoin(data.data[params.id])
	}

	useEffect(() => {
		initData()

		console.log(coin)
	}, [params.slug])

	return (
		<div>
			{coin?.name ? (
				<Row>
					<Col span={6}>
						<Space>
							<Image src={coin?.logo} alt={`${coin?.name}`} width={30} height={30} />
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
