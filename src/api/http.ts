import axios, { AxiosInstance, AxiosPromise } from 'axios';
import { stringify } from 'qs';

type ApiResponse<T = null> = {
	status: {
		total_count: number;
	};
	data: any[];
};

const instance: AxiosInstance = axios.create({ timeout: 60000 });

const post = <T>(url: string, data = {}): AxiosPromise<ApiResponse<T>> =>
	instance.post(url, data, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

const get = <T>(url: string, data = {}): AxiosPromise<ApiResponse<T>> =>
	instance.get(
		`${url}${
			stringify(data)
				? '?CMC_PRO_API_KEY=8549b864-032f-404a-83ce-a28bed9ef45b&' + stringify(data)
				: '?CMC_PRO_API_KEY=8549b864-032f-404a-83ce-a28bed9ef45b'
		}`
	);

export { post, get };
