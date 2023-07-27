import { message } from 'antd'
import { throttle } from 'lodash'

export const throttleAlert = msg => throttle(message.error(msg), 1500, { trailing: false })
