import { TExchangeDetail, ExchangePap } from '@/api'
import { extractDomain } from '@/utils'
import { FacebookFilled, PushpinFilled, RedditCircleFilled, TwitterCircleFilled } from '@ant-design/icons'
import { Typography } from 'antd'
import React, { FC } from 'react'

const { Link } = Typography

type Props = {
	exchange: TExchangeDetail
	pap: ExchangePap
}

const Links: FC<Props> = ({ exchange }) => {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
			<div style={{ display: 'flex', gap: '10px' }}>
				<PushpinFilled />
				<Link href={exchange.url} target="_blank">
					{' '}
					{extractDomain(exchange.url)}
				</Link>
			</div>
			{exchange.reddit_url && (
				<div style={{ display: 'flex', gap: '10px' }}>
					<RedditCircleFilled />
					<Link>{extractDomain(exchange.reddit_url)}</Link>
				</div>
			)}
			<div style={{ display: 'flex', gap: '10px' }}>
				<FacebookFilled />
				<Link>{extractDomain(exchange.facebook_url)}</Link>
			</div>
			<div style={{ display: 'flex', gap: '10px' }}>
				<TwitterCircleFilled />
				<Link href={`https://twitter.com/${exchange.twitter_handle}`}>Twitter</Link>
			</div>
		</div>
	)
}

export default Links
