import { formatPrice } from '@/constants'
import { useAppSelector } from '@/redux/store'
import { numberWithCommas } from '@/utils'
import { Typography, Divider } from 'antd'
import React, { FC } from 'react'

type Props = {
	title: string
	dataSign?: number
	dataSym?: number
	data?: string
	divider?: boolean
}

const StatsTitle: FC<Props> = ({ dataSign, data, title, dataSym, divider = true }) => {
	const { sign } = useAppSelector(state => state.setCurrency.value)
	const coin = useAppSelector(state => state.setCoin.value)

	return (
		<>
			<div style={{ justifyContent: 'space-between', display: 'flex' }}>
				<Typography.Text type="secondary">{title}</Typography.Text>
				{dataSign && <Typography.Text strong>{formatPrice(sign, dataSign)}</Typography.Text>}
				{dataSym && (
					<Typography.Text strong>
						{numberWithCommas(dataSym)} {coin.symbol}
					</Typography.Text>
				)}
				{data && <Typography.Text strong>{data}</Typography.Text>}
			</div>
			{divider && <Divider />}
		</>
	)
}

export default StatsTitle
