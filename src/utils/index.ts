import * as accounting from 'accounting-js'
import numeral from 'numeral'

export const formatPrice = (num: number | string, sym = '$', precision = 2) => {
	if (sym) {
		return accounting.formatMoney(num, precision, sym)
	} else {
		accounting.formatMoney(num, precision, '')
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
