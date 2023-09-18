import { useAppSelector } from '@/redux/store'
import { formatPrice, numberWithCommas } from '@/utils'
import { Col, Divider, Typography } from 'antd'
import React, { FC } from 'react'

const { Text, Paragraph } = Typography

type Props = {
	data?: number
	title: string
	volMcap?: boolean
	divider?: boolean
	supply?: boolean
}

const MarketData: FC<Props> = ({ data, title, volMcap = false, divider = true, supply = false }) => {
	const { sign, symbol } = useAppSelector(state => state.setCurrency.value)
	const quotes = useAppSelector(state => state.setQuotes.value)

	return (
		<>
			<Col span={5.5}>
				<Text strong>{title}:</Text>
				{data && (
					<div>
						<Paragraph style={{ paddingBlock: '1rem' }}>{formatPrice(data, sign)}</Paragraph>
					</div>
				)}
				{volMcap && (
					<div>
						<Text strong>Volume / MarketCap:</Text>
						<Paragraph>
							{((quotes?.quote[symbol]?.volume_24h / quotes?.quote[symbol]?.market_cap) * 100).toFixed(2)}
							%
						</Paragraph>
					</div>
				)}
				{supply && (
					<>
						<Paragraph style={{ paddingBlock: '1rem' }}>
							{numberWithCommas(quotes.circulating_supply)}
						</Paragraph>
						<div>
							<Text strong>Max Supply: </Text>
							<Text>{!quotes.max_supply ? '∞' : numberWithCommas(quotes.max_supply)}</Text>
						</div>
						<div style={{}}>
							<Text strong>Total Supply: </Text>
							<Text>{numberWithCommas(quotes.total_supply)}</Text>
						</div>
					</>
				)}
			</Col>
			{divider && (
				<Col span={0.5}>
					<Divider type="vertical" style={{ blockSize: '100%' }} />
				</Col>
			)}
		</>
	)
}

export default MarketData
