import CryptoCurrency from '@/pages/cryptocurrency';
import Exchanges from '@/pages/exchanges';
import Root from '@/pages/root';
import '@/styles/global.module.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@/store';

const router = createBrowserRouter([
	{ path: '/', element: <Root /> },
	{ path: '/cryptocurrency', element: <CryptoCurrency /> },
	{ path: '/exchanges', element: <Exchanges /> }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
