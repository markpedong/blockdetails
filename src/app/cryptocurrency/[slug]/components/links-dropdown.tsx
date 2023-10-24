import { extractDomain } from '@/utils'
import { DownOutlined, ExclamationCircleOutlined, LinkOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Dropdown, Tag, Typography } from 'antd'
import React, { FC } from 'react'

type Props = {
	data?: string
	dataArr?: string[]
	title?: string
}

const LinksDropdown: FC<Props> = ({ dataArr, title, data }) => (
	<>
		{dataArr?.length > 0 && (
			<Tag icon={<ExclamationCircleOutlined />} closable={false}>
				<Dropdown
					menu={{
						items: dataArr?.map((item, index) => ({
							key: index,
							label: (
								<Typography.Link target="_blank" href={item}>
									{extractDomain(item)}
								</Typography.Link>
							)
						}))
					}}
					placement="bottom"
					arrow
				>
					<span style={{ fontWeight: 700 }}>
						{title}
						<DownOutlined style={{ paddingLeft: '5px' }} />
					</span>
				</Dropdown>
			</Tag>
		)}
		{data && (
			<Tag icon={<LinkOutlined />} closeIcon={<ShareAltOutlined />}>
				<Typography.Link href={data} target="_blank">
					<span style={{ fontWeight: 700 }}>{extractDomain(data)}</span>
				</Typography.Link>
			</Tag>
		)}
	</>
)

export default LinksDropdown
