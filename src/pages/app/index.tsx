import menus from '@/pages/menus';
import { ActionType, ProLayout } from '@ant-design/pro-components';
import { Typography } from 'antd';
import { cloneDeep } from 'lodash';
import { FC, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const App: FC = () => {
	const { pathname } = useLocation();
	const actionRef = useRef<ActionType>();
	const navigate = useNavigate();

	return (
		<ProLayout
			location={{ pathname }}
			actionRef={actionRef}
			title="Blockdetails"
			route={{ routes: cloneDeep(menus) }}
			menuItemRender={(item, dom) => {
				return <Typography.Link onClick={() => navigate(item.path as string)}>{dom}</Typography.Link>;
			}}
		>
			<div>
				<Outlet />
			</div>
		</ProLayout>
	);
};

export default App;
