import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Tag, message } from 'antd'
import { throttle } from 'lodash'

export const throttleAlert = msg => throttle(message.error(msg), 1500, { trailing: false })

export const renderPer = (per: number) => (
	<span style={{ color: per > 0.01 ? '#16c784' : '#ea3943' }}>
		{per > 0.01 ? <CaretUpOutlined /> : <CaretDownOutlined />}
		{per?.toFixed(2).replace('-', '')}%
	</span>
)

export const renderPercentage = (per: number) => (
	<Tag color={per > 0.01 ? '#16c784' : '#ea3943'}>
		{per > 0.01 ? <CaretUpOutlined /> : <CaretDownOutlined />} {per?.toFixed(2).replace('-', '')} %
	</Tag>
)

export const renderScore = (per: number) => (
	<Tag color={per > 6.1 ? '#16c784' : per <= 6 ? 'orange' : '#ea3943'}>{per?.toFixed(2)}</Tag>
)
