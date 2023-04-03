import { ModalFormProps, ProTableProps } from '@ant-design/pro-components';

export const PRO_TABLE_PROPS: ProTableProps<any, any> = {
	options: false,
	scroll: { x: 1000 },
	rowKey: 'id',
	tableStyle: { paddingBlock: '30px' },
	search: { labelWidth: 'auto', collapsed: false, collapseRender: false },
	pagination: {
		defaultCurrent: 1,
		defaultPageSize: 20,
		size: 'default'
	}
};

export const MODAL_FORM_PROPS: ModalFormProps = {
	labelCol: { flex: '110px' },
	layout: 'horizontal',
	width: 800
};
