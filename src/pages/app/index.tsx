import logo from '@/assets/logo.png';
import { MODAL_FORM_PROPS } from '@/constants';
import menus from '@/pages/menus';
import { ActionType, ModalForm, ProFormText, ProLayout } from '@ant-design/pro-components';
import { Typography } from 'antd';
import { cloneDeep } from 'lodash';
import { FC, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const App: FC = () => {
	const { pathname } = useLocation();
	const actionRef = useRef<ActionType>();
	const navigate = useNavigate();

	const renderSearchbar = () => {
		return (
			<ModalForm
				{...MODAL_FORM_PROPS}
				title="Search"
				trigger={<Typography.Link>Search</Typography.Link>}
				onFinish={async value => {
					console.log(value);
				}}
			>
				<ProFormText label="Search" name="search" />
			</ModalForm>
		);
	};

	return (
		<ProLayout
			location={{ pathname }}
			actionRef={actionRef}
			title="Blockdetails"
			fixSiderbar
			fixedHeader
			layout="mix"
			headerTitleRender={() => (
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<img src={logo} />
					<h1>BlockDetails</h1>
				</div>
			)}
			route={{ routes: cloneDeep(menus) }}
			menuItemRender={(item, dom) => {
				return (
					<Typography.Link
						style={{ paddingBlockStart: '0.5rem' }}
						onClick={() => navigate(item.path as string)}
					>
						{dom}
					</Typography.Link>
				);
			}}
			actionsRender={() => [renderSearchbar()]}
		>
			<Outlet />
		</ProLayout>
	);
};

export default App;
