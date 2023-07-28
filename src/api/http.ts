import { throttleAlert } from '@/utils/index'
import axios, { AxiosInstance, AxiosPromise } from 'axios'
import { stringify } from 'qs'

//@ts-ignore
type ApiResponse<T = null> = {
	data: any
	total: number
	success: boolean
	message: string
}

const instance: AxiosInstance = axios.create({
	timeout: 60000
})

instance.interceptors.response.use(
	response => response,
	// error => {
	//     const { response } = error
	//     if (response && response.status !== 200) {
	//         const errorMessage = response.data.message || 'An error occurred'
	//         throttleAlert(errorMessage)
	//         return Promise.reject(response.data)
	//     }
	//     return Promise.reject(error)
	// }
	err => throttleAlert(String(err))
)

const post = <T>(url: string, data = {}): AxiosPromise<ApiResponse<T>> =>
	instance.post(url, data, {
		headers: {
			'Content-Type': 'application/json'
		}
	})

const get = <T>(url: string, data = {}): AxiosPromise<ApiResponse<T>> =>
	instance.get(`${url}${stringify(data) ? '?' + stringify(data) : ''}`, {
		headers: {
			'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_API_KEY
		}
	})

export { post, get }
