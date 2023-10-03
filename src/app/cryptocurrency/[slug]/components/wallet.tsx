'use client'

import { wallet_types, wallets } from '@/constants/wallet'
import { Button, Card, Space, Typography } from 'antd'
import Image from 'next/image'
import { FC, useState } from 'react'

type Props = {}

const Wallets: FC<Props> = () => {
	const [readMore, setReadMore] = useState(false)

	return (
		<div>
			<Typography.Title level={2}>Wallets</Typography.Title>
			<Typography.Text>
				We show you the providers so you can make an informed wallet choice to store your bitcoin, ether or
				crypto currency of your choice.{' '}
				<Button type="primary" onClick={() => setReadMore(!readMore)}>
					READ MORE
				</Button>
			</Typography.Text>
			<div>
				{readMore && (
					<>
						<Typography.Title level={4}>What Are Cryptocurrency Wallets?</Typography.Title>
						<Typography.Text>
							Cryptocurrency{' '}
							<a target="_blank" href="https://coinmarketcap.com/alexandria/glossary/wallet">
								Wallet
							</a>{' '}
							are software programs that store private and public keys and interface with various
							blockchain to enable users to send and receive digital currency and monitor their balance.
							It is the equivalent of a bank account where you can both deposit and withdraw funds from
							(though only the latter with cryptocurrency). Cryptocurrency wallets store private and
							public keys and facilitate the sending and receiving of digital currency and monitor all
							transactions to protect from identity theft. The private key is used to authorize payments,
							while the public key is used to access received funds., Cryptocurrency wallets can be hot,
							meaning that they are connected to the internet, or cold, meaning that they have no internet
							connection. When deciding whether to use a{' '}
							<a target="_blank" href="https://coinmarketcap.com/currencies/solana/wallets/">
								{' '}
								hot wallet vs a cold wallet{' '}
							</a>
							, you need to consider several factors: while hot wallets are often more user friendly, they
							also carry a higher risk of loss of funds due to their internet connection.
						</Typography.Text>
						<Typography.Title level={4}>
							What Are the Main Types of Cryptocurrency Wallets?
						</Typography.Title>
						<div>
							{wallet_types.map(i => (
								<div key={i.title}>
									<Typography.Title level={4} style={{ color: '#1677ff' }}>
										{i.title}
									</Typography.Title>
									<span dangerouslySetInnerHTML={{ __html: i.description }} />
								</div>
							))}
						</div>
					</>
				)}
			</div>
			<Space direction="horizontal" wrap size={20} style={{ paddingBlockStart: 30 }}>
				{wallets.map(item => (
					<Card
						style={{
							width: 300
						}}
						hoverable
						key={item.title}
					>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<Image src={item.img} alt={item.title} style={{ height: '100px', width: 'auto' }} />
							<Typography.Title level={5}>{item.title}</Typography.Title>
							<Typography.Link>{item.link}</Typography.Link>
						</div>
					</Card>
				))}
			</Space>
		</div>
	)
}

export default Wallets
