import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Tag } from 'antd'

export const renderPercentage = (per: number) => (
	<Tag color={per > 0.01 ? 'green' : 'red'}>
		{per > 0.01 ? <CaretUpOutlined /> : <CaretDownOutlined />} {per?.toFixed(2).replace('-', '')}
	</Tag>
)

export const renderScore = (per: number) => (
	<Tag color={per > 6.1 ? 'green' : per <= 6 ? 'orange' : 'red'}>{per?.toFixed(2)}</Tag>
)
