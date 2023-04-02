import App from '@/pages/app';
import Coin from '@/pages/coin';
import menus from '@/pages/menus';
import { cloneDeep } from 'lodash';
import React, { FC } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

const Root: FC = () => {
	const menu = cloneDeep(menus);
	return useRoutes([
		{
			path: '/',
			element: <App />,
			children: [
				...menu,
				{
					path: '/coin',
					element: <Coin />
				}
			]
		},
		{
			path: '*',
			element: <Navigate to="/" />
		}
	]);
};

export default Root;
