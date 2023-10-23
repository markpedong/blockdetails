import { getCoinCG } from '@/redux/features/coinGSlice'
import { useAppSelector } from '@/redux/store'
import React, { FC } from 'react'

const About: FC = () => {
	const coinCG = useAppSelector(getCoinCG)
	console.log('coin', coinCG)

	return <div>{coinCG.description.en}</div>
}

export default About
