import { ModalFormProps, ProTableProps } from '@ant-design/pro-components';

export const PRO_TABLE_PROPS: ProTableProps<any, any> = {
	options: false,
	scroll: { x: 1200 },
	search: {
		labelWidth: 'auto',
		collapsed: false,
		collapseRender: false,
		span: {
			xs: 24,
			sm: 12,
			md: 8,
			lg: 6,
			xl: 6,
			xxl: 4
		}
	},
	pagination: {
		defaultPageSize: 20,
		showSizeChanger: true
	}
};

export const MODAL_FORM_PROPS: ModalFormProps = {
	labelCol: { flex: '110px' },
	layout: 'horizontal',
	width: 800,
	modalProps: {
		destroyOnClose: true,
		maskClosable: false
	},
	wrapperCol: { flex: 1 },
	autoFocusFirstInput: true,
	preserve: false,
	size: 'large'
};
