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

const get = async <T>(url: string, data = {}, key = true, interval = 600000): Promise<ApiResponse<T>> => {
	const queryParams = stringify(data)
	const fullUrl = queryParams ? `${url}?${queryParams}` : url

	const headers = key ? { 'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_API_KEY_PROD } : {}

	let result: ApiResponse<T>

	const fetchData = async () => {
		// Check if data already exists in local storage
		if (typeof window !== 'undefined') {
			const storedData = localStorage.getItem(url)

			if (storedData) {
				result = JSON.parse(storedData)
				return
			}
		}

		try {
			const res = await fetch(fullUrl, {
				method: 'GET',
				headers: headers
			})

			if (!res.ok) {
				// This will activate the closest `error.js` Error Boundary
				throttleAlert(`Error: ${res.status}!`)
			}

			result = await res.json()

			if (typeof window !== 'undefined') {
				// Perform localStorage action
				localStorage.setItem(url, JSON.stringify(result))
			}
			// Store data in local storage
		} catch (error) {
			console.error('Error:', error)
			result = error // You might want to handle or rethrow the error here
		}
	}

	await fetchData()
	setInterval(fetchData, interval) // Call fetchData at the specified interval

	return result
}

export { get }
