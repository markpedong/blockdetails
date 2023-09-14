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

const get = async <T>(url: string, data = {}, key = true): Promise<ApiResponse<T>> =>
	await (
		await fetch(`${url}${stringify(data) ? '?' + stringify(data) : ''} `, {
			headers: key
				? {
						'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_API_KEY_PROD
				  }
				: {},
			next: {
				revalidate: 6000
			}
		})
	).json()

export { get }
