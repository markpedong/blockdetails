import Root from '@/pages/root';
import '@/store';
import '@/styles/global.module.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<Root />
		</BrowserRouter>
	</React.StrictMode>
);
