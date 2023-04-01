import App from '@/pages/app';
import menus from '@/pages/menus';
import { cloneDeep } from 'lodash';
import React, { FC } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

const Root: FC = () =>
	useRoutes([
		{
			path: '/',
			element: <App />,
			children: cloneDeep(menus)
		},
		{
			path: '*',
			element: <Navigate to="/" />
		}
	]);

export default Root;
