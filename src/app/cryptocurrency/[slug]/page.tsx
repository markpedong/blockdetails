import { getCryptoDetail } from '@/api'
import { Col, Row } from 'antd'
import React, { FC, use } from 'react'
// localization=true&market_data=true&community_data=false&developer_data=true&sparkline=true

const detail = getCryptoDetail({
	localization: true,
	market_data: true,
	community_data: false,
	developer_data: true,
	sparkline: true
})

const Detail: FC = ({ params }: { params: any }) => {
	const coin = use(detail)
	console.log(coin)
	return (
		<div>
			<Row>
				<Col></Col>
			</Row>
			{params.slug}
		</div>
	)
}

export default Detail
