import Root from '@/pages/root';
import '@/store';
import '@/styles/global.module.scss';
import { ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import enUS from 'antd/locale/en_US';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ConfigProvider locale={enUS}>
			<BrowserRouter>
				<Root />
			</BrowserRouter>
		</ConfigProvider>
	</React.StrictMode>
);
