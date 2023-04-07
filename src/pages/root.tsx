import App from '@/pages/app';
import Coin from '@/pages/coin';
import Exchange from '@/pages/exchange';
import menus from '@/pages/menus';
import { cloneDeep } from 'lodash';
import { FC } from 'react';
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
					path: '/cryptocurrency/:id',
					element: <Coin />
				},
				{
					path: '/exchanges/:id',
					element: <Exchange />
				},
				{
					path: '*',
					element: <Navigate to="/" />
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
