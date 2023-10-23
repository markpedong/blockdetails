import { TExchangeDetail, ExchangePap } from '@/api'
import { extractDomain } from '@/utils'
import { FacebookFilled, PushpinFilled, RedditCircleFilled, TwitterCircleFilled } from '@ant-design/icons'
import { Flex, Typography } from 'antd'
import React, { FC } from 'react'

const { Link } = Typography

type Props = {
	exchange: TExchangeDetail
	pap: ExchangePap
}

const Links: FC<Props> = ({ exchange }) => {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
			<Flex style={{ gap: '10px' }}>
				<PushpinFilled />
				<Link href={exchange.url} target="_blank">
					{extractDomain(exchange.url)}
				</Link>
			</Flex>
			{exchange.reddit_url && (
				<Flex style={{ gap: '10px' }}>
					<RedditCircleFilled />
					<Link href={exchange.reddit_url} target="_blank">
						{extractDomain(exchange.reddit_url)}
					</Link>
				</Flex>
			)}
			<Flex style={{ gap: '10px' }}>
				<FacebookFilled />
				<Link href={exchange.facebook_url} target="_blank">
					{extractDomain(exchange.facebook_url)}
				</Link>
			</Flex>
			<Flex style={{ gap: '10px' }}>
				<TwitterCircleFilled />
				<Link href={`https://twitter.com/${exchange.twitter_handle}`} target="_blank">
					Twitter
				</Link>
			</Flex>
		</div>
	)
}

export default Links
