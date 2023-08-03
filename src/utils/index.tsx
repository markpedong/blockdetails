import { message } from 'antd'
import { throttle } from 'lodash'
import numeral from 'numeral'

export const throttleAlert = msg => throttle(message.error(msg), 1500, { trailing: false })

export const numberWithCommas = (number: number) => {
	if (number >= 1) {
		return number?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	} else if (number >= 0.1) {
		return number?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	} else if (number >= 0.001) {
		return number?.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })
	} else {
		return number?.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 })
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
		return number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	}
}
