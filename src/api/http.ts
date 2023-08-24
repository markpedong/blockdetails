import { throttleAlert } from '@/utils/index'
import { stringify } from 'qs'

type ApiResponse<T = null> = {
	[x: string]: any
	data: T[] | any
	status: {
		timestamp: string
		error_code: number
		error_message: string
		elapsed: number
		credit_count: number
		total_count: number
	}
}

const get = async <T>(url: string, data = {}, key = true): Promise<ApiResponse<T>> => {
	const queryParams = stringify(data)
	const fullUrl = queryParams ? `${url}?${queryParams}` : url

	const headers = key ? { 'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_API_KEY_PROD } : {}

	try {
		const res = await fetch(fullUrl, {
			method: 'GET',
			headers: headers
		})

		if (!res.ok) {
			// This will activate the closest `error.js` Error Boundary
			throttleAlert(`Error: ${res.status}!`)
		}

		return res.json()
	} catch (error) {
		console.error('Error:', error)
		return error // You might want to handle or rethrow the error here
	}
}

export { get }
