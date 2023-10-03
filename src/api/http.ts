import { stringify } from 'qs'

type ApiResponse<T = null> = {
	[x: string]: any
	data: T[] | any
}

const get = async <T>(url: string, data = {}, key = true): Promise<ApiResponse<T>> =>
	await (
		await fetch(`${url}${stringify(data) ? '?' + stringify(data) : ''} `, {
			headers: key
				? {
						'X-CMC_PRO_API_KEY': process.env.API_KEY_PROD
				  }
				: {},
			next: {
				revalidate: 6000
			}
		})
	).json()

export { get }
