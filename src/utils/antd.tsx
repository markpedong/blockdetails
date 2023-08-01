import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Tag } from 'antd'

export const renderPercentage = (per: number) => (
	<Tag color={per === 0.0 ? 'cyan' : per > 0.01 ? 'green' : 'red'}>
		{per === 0.0 ? null : per > 0.01 ? <CaretUpOutlined /> : <CaretDownOutlined />}
		{per.toFixed(2).replace('-', '')}
	</Tag>
)
