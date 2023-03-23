import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/root';
import './styles/global.module.scss';
import $$global from './state/index';
import { run } from 'concent';

run({ $$global });

const router = createBrowserRouter([{ path: '/', element: <Root /> }]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
