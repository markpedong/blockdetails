import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

export const renderPercentage = percentage => {
	const per = percentage?.toFixed(2);

	return (
		<span
			style={{
				color: per > 0.0 ? '#16c784' : '#ea3943'
			}}
		>
			{per > 0.0 ? <CaretUpOutlined /> : per < 0.0 ? <CaretDownOutlined /> : !per && ''} {per?.replace('-', '')}
		</span>
	);
};
