import { GetTrendingResponse, getTrending } from '@/api'
import { useAppSelector } from '@/redux/store'
import { numberWithCommas } from '@/utils'
import ProCard from '@ant-design/pro-card'
import { Space, Typography } from 'antd'
import Image from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import { ValuesType } from 'utility-types'

type TTrending = ValuesType<GetTrendingResponse['coins'][]>

const Trending: FC = () => {
	const coinCG = useAppSelector(state => state.setCoinCG.value)
	const [coins, setCoins] = useState<TTrending>()

	const initInfo = async () => {
		const data = await getTrending()

		setCoins(data.coins)
	}

	useEffect(() => {
		initInfo()
	}, [coinCG.id])

	return (
		<div>
			<Typography.Title level={4}>Trending Coins and Tokens 🔥</Typography.Title>
			<Space direction="horizontal" wrap>
				{coins?.map(i => {
					const coin = i.item

					return (
						<ProCard
							wrap
							key={coin.id}
							title={
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '10px',
										paddingInlineEnd: '10px'
									}}
								>
									<Image src={coin.large} alt={coin.id} width={25} height={25} />
									<Typography.Link>{coin.name}</Typography.Link>
								</div>
							}
							extra={`#${coin.market_cap_rank}`}
							style={{ marginBlockStart: 24 }}
							size="default"
						>
							<div>₿ {numberWithCommas(coin.price_btc)}</div>
						</ProCard>
					)
				})}
			</Space>
		</div>
	)
}

export default Trending
