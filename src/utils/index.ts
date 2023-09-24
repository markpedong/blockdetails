import formatMoney from 'accounting-js/lib/formatMoney.js'
import numeral from 'numeral'

export const formatPrice = (num: number | string, symbol?, precision = 2) => {
	if (num) {
		return formatMoney(num, { symbol, precision })
	} else {
		formatMoney(num, {
			symbol: '',
			precision
		})
	}
}

export const numberWithSuffix = (number: number) => {
	const suffixes = ['', 'K', 'M', 'B', 'T'] // Suffixes for thousands, millions, billions, trillions
	let magnitude = Math.floor(Math.log10(number) / 3) // Calculate the magnitude in terms of thousands

	if (magnitude > 0) {
		// Divide the number by the appropriate power of 1000
		let formattedNumber = number / Math.pow(1000, magnitude)

		// Get the appropriate suffix for the magnitude
		let suffix = suffixes[magnitude]

		// Format the number using numeral.js with one decimal place
		return numeral(formattedNumber).format('0.0') + suffix
	} else {
		// For numbers less than 1000 or 1, return the actual value
		return number?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	}
}

export const numberWithCommas = (number: number) => {
	if (number >= 1) {
		return numeral(number).format('0,0.00')
	} else if (number >= 0.1) {
		return numeral(number).format('0,0.00')
	} else if (number >= 0.001) {
		return numeral(number).format('0,0.0000')
	} else {
		return numeral(number).format('0,0.00000000')
	}
}

export const extractDomain = (url: string) => {
	// Remove protocol (http, https, etc.)
	const withoutProtocol = url.replace(/^(https?:\/\/)?(www\.)?/, '')

	// Remove path and query parameters
	const parts = withoutProtocol.split('/')
	const domain = parts[0].replace(/\.com$/, '')

	return domain
}
