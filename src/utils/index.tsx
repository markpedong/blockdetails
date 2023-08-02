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
