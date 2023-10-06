import { TExchangeDetail } from '@/api'
import { useAppSelector } from '@/redux/store'
import { formatPrice } from '@/utils'
import { BookFilled } from '@ant-design/icons'
import { Col, Row, Typography } from 'antd'
import { FC } from 'react'

type Props = {
	exchange: TExchangeDetail
}

const MarketTitle: FC<{
	title: string
	data: number | string
}> = ({ title, data }) => {
	return (
		<div style={{ display: 'grid' }}>
			<Typography.Text strong>{title}</Typography.Text>
			<Typography.Link>{data}</Typography.Link>
		</div>
	)
}

const MarketData: FC<Props> = ({ exchange }) => {
	const detail = useAppSelector(state => state.exchange.detail)
	const { sign, symbol } = useAppSelector(state => state.global.currency)

	return (
		<Row style={{ marginBlockStart: '3rem' }}>
			<Col span={12}>
				<MarketTitle
					title="Volume (24h)"
					data={formatPrice(detail?.quotes[symbol]?.reported_volume_24h, sign)}
				/>
				<MarketTitle title="Currencies" data={detail?.currencies} />
				<MarketTitle title="Confidence Score" data={detail?.confidence_score.toFixed(2)} />
				<div style={{ paddingBlockStart: '1rem', gap: '5px', display: 'flex' }}>
					<BookFilled />
					<a href={exchange.other_url_1} target="_blank">
						Read More:
					</a>
				</div>
			</Col>
			<Col span={12}>
				<MarketTitle
					title="Volume (30d)"
					data={formatPrice(detail?.quotes[symbol]?.reported_volume_30d, sign)}
				/>
				<MarketTitle title="Market" data={detail?.markets} />
				<MarketTitle title="Score" data={exchange.trust_score} />
				<div style={{ paddingBlockStart: '1rem', gap: '5px', display: 'flex' }}>
					<BookFilled />
					<a href={exchange.other_url_2} target="_blank">
						Read More:
					</a>
				</div>
			</Col>
		</Row>
	)
}

export default MarketData
