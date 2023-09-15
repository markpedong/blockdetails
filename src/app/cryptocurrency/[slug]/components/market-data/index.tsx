import { useAppSelector } from '@/redux/store'
import { formatPrice, numberWithCommas } from '@/utils'
import { Col, Divider, Typography } from 'antd'
import React, { FC } from 'react'

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
				<Typography.Text strong>{title}:</Typography.Text>
				{data && <div style={{ paddingBlockStart: '1rem' }}>{formatPrice(data, sign)}</div>}
				{volMcap && (
					<div style={{ paddingBlockStart: '1.5rem' }}>
						<Typography.Text strong>Volume / MarketCap:</Typography.Text>
						<div style={{ paddingBlock: '0.5rem' }}>
							{((quotes?.quote[symbol]?.volume_24h / quotes?.quote[symbol]?.market_cap) * 100).toFixed(2)}
							%
						</div>
					</div>
				)}
				{supply && (
					<>
						<div style={{ paddingBlock: '1rem' }}>{numberWithCommas(quotes.circulating_supply)}</div>
						<div style={{ paddingBlockStart: '1rem' }}>
							<Typography.Text strong>Max Supply: </Typography.Text>
							{!quotes.max_supply ? '∞' : numberWithCommas(quotes.max_supply)}
						</div>
						<div style={{}}>
							<Typography.Text strong>Total Supply: </Typography.Text>
							{numberWithCommas(quotes.total_supply)}
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
