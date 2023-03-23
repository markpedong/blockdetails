import axios, { AxiosInstance, AxiosPromise } from 'axios';

type ApiResponse<T = null> = {
	token: any;
	data: any;
	message: string;
	status: string;
	status_code: number;
};

const instance: AxiosInstance = axios.create({ timeout: 60000 });

const post = <T>(url: string, data = {}): AxiosPromise<ApiResponse<T>> =>
	instance.post(url, data, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

const get = <T>(url: string, data = {}): AxiosPromise => instance.get(`${url}${data}`);

export { post, get };
