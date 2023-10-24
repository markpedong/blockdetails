import { TExchangeDetail } from '@/api'
import { getExchangeDetail } from '@/redux/features/exchangeSlice'
import { getAllCurrency } from '@/redux/features/globalSlice'
import { useAppSelector } from '@/redux/store'
import { formatPrice } from '@/utils'
import { BookFilled } from '@ant-design/icons'
import { Col, Flex, Row, Typography } from 'antd'
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
			<Typography.Link>{data ?? '-'}</Typography.Link>
		</div>
	)
}

const MarketData: FC<Props> = ({ exchange }) => {
	const detail = useAppSelector(getExchangeDetail)
	const { sign, symbol } = useAppSelector(getAllCurrency)
	const market = detail?.quotes?.[symbol]

	return (
		<Row style={{ marginBlockStart: '3rem' }}>
			<Col span={12}>
				<MarketTitle title="Volume (24h)" data={formatPrice(market?.reported_volume_24h, sign)} />
				<MarketTitle title="Currencies" data={detail?.currencies} />
				<MarketTitle title="Confidence Score" data={detail?.confidence_score?.toFixed(2)} />
				<Flex style={{ paddingBlockStart: '1rem', gap: '5px' }}>
					<BookFilled />
					<a href={exchange.other_url_1} target="_blank">
						Read More:
					</a>
				</Flex>
			</Col>
			<Col span={12}>
				<MarketTitle title="Volume (30d)" data={formatPrice(market?.reported_volume_30d, sign)} />
				<MarketTitle title="Market" data={detail?.markets} />
				{exchange.trust_score && <MarketTitle title="Score" data={exchange.trust_score} />}
				<Flex style={{ paddingBlockStart: '1rem', gap: '5px' }}>
					<BookFilled />
					<a href={exchange.other_url_2} target="_blank">
						Read More:
					</a>
				</Flex>
			</Col>
		</Row>
	)
}

export default MarketData
