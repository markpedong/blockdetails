import { throttleAlert } from '@/utils/index'
import { stringify } from 'qs'

type ApiResponse<T = null> = {
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

const get = async <T>(url: string, data = {}): Promise<ApiResponse<T>> => {
	const res = await fetch(`${url}${stringify(data) ? '?' + stringify(data) : ''}`, {
		method: 'GET',
		headers: {
			'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_API_KEY_PROD
		} as {}
	})

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throttleAlert(`${res.status} ${res.statusText}`)
	}

	return res.json()
}

export { get }
