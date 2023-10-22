import formatMoney from 'accounting-js/lib/formatMoney.js'
import { ReadonlyURLSearchParams } from 'next/navigation'
import numeral from 'numeral'

export const formatPrice = (num: number | string, symbol = '$', precision = 2) => {
	if (num) {
		return formatMoney(num, { symbol, precision })
	} else {
		formatMoney(num, {
			symbol: '',
			precision
		})
	}
}

export const numberWithSuffix = (number): string => {
	// Set a threshold value for abbreviation (e.g., 1 million)
	const abbreviationThreshold = 1000000

	// Check if the number is smaller than the threshold
	if (number < abbreviationThreshold) {
		return numeral(number).format('0,0') // Format small numbers with commas
	} else {
		const formatted = numeral(number).format('0.0a') // Abbreviate larger numbers
		return formatted.toUpperCase()
	}
}

export const numberWithCommas = number => {
	const formats = [
		{ threshold: 1, format: '0,0.00' },
		{ threshold: 0.1, format: '0,0.00' },
		{ threshold: 0.001, format: '0,0.000' },
		{ threshold: 0.0001, format: '0,0.0000' },
		{ threshold: 0, format: '0,0.00000000' }
	]

	for (let format of formats) {
		if (number >= format.threshold) {
			return numeral(number).format(format.format)
		}
	}
}

export const extractDomain = (url: string) => {
	// Remove protocol (http, https, etc.)
	const withoutProtocol = url?.replace(/^(https?:\/\/)?(www\.)?/, '')

	// Remove path and query parameters
	const parts = withoutProtocol?.split('/')
	const domain = parts?.[0].replace(/\.com$/, '')

	return domain
}

export const navigate = (url: string, params?: ReadonlyURLSearchParams) => `${url}${params ? '?' + params : ''}`
