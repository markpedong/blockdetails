import { ProCard } from '@ant-design/pro-components';
import { Carousel } from 'antd';

const Header = () => {
	return (
		<Carousel>
			<ProCard title="默认尺寸" extra="extra" tooltip="这是提示" style={{ maxWidth: 300 }}>
				<div>Card content</div>
				<div>Card content</div>
				<div>Card content</div>
			</ProCard>
			<ProCard title="默认尺寸" extra="extra" tooltip="这是提示" style={{ maxWidth: 300 }}>
				<div>Card content</div>
				<div>Card content</div>
				<div>Card content</div>
			</ProCard>
			<ProCard title="默认尺寸" extra="extra" tooltip="这是提示" style={{ maxWidth: 300 }}>
				<div>Card content</div>
				<div>Card content</div>
				<div>Card content</div>
			</ProCard>
			<ProCard title="默认尺寸" extra="extra" tooltip="这是提示" style={{ maxWidth: 300 }}>
				<div>Card content</div>
				<div>Card content</div>
				<div>Card content</div>
			</ProCard>
			<ProCard title="默认尺寸" extra="extra" tooltip="这是提示" style={{ maxWidth: 300 }}>
				<div>Card content</div>
				<div>Card content</div>
				<div>Card content</div>
			</ProCard>
		</Carousel>
	);
};

export default Header;
