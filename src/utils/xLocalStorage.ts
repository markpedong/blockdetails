import { isArray, isObject, isString } from 'lodash'
import { compress, decompress } from 'lz-string'

export const setLocalStorage = (key: string, value: string | object | [any]) => {
	if (typeof window !== 'undefined') {
		if (isObject(value) || isArray(value) || isString(value)) {
			value = JSON.stringify(value)
		}

		localStorage[compress(key)] = compress(value as string)
	}
}

export const getLocalStorage = (key: string) => {
	if (typeof window !== 'undefined') {
		let value = decompress(localStorage[compress(key)])

		if (value !== null) {
			try {
				value = JSON.parse(value)
				return value
			} catch (error) {
				console.error('Error parsing JSON from localStorage:', error)
			}
		}
	}
}
