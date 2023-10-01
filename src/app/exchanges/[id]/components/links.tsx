import { ExchangeDetail, ExchangePap } from '@/api'
import { extractDomain } from '@/utils'
import { FacebookFilled, PushpinFilled, RedditCircleFilled, TwitterCircleFilled } from '@ant-design/icons'
import { Space, Typography } from 'antd'
import React, { FC } from 'react'

type Props = {
	exchange: ExchangeDetail
	pap: ExchangePap
}

const Links: FC<Props> = ({ exchange, pap }) => {
	return (
		<Space direction="vertical">
			<div style={{ display: 'flex', gap: '10px' }}>
				<PushpinFilled />
				<Typography.Link>{extractDomain(exchange.url)}</Typography.Link>
			</div>
			<div style={{ display: 'flex', gap: '10px' }}>
				<RedditCircleFilled />
				<Typography.Link>{extractDomain(exchange.reddit_url)}</Typography.Link>
			</div>
			<div style={{ display: 'flex', gap: '10px' }}>
				<FacebookFilled />
				<Typography.Link>{extractDomain(exchange.facebook_url)}</Typography.Link>
			</div>
			<div style={{ display: 'flex', gap: '10px' }}>
				<TwitterCircleFilled />
				<Typography.Link href={`https://twitter.com/${exchange.twitter_handle}`}>Twitter</Typography.Link>
			</div>
		</Space>
	)
}

export default Links
