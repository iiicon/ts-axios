import { isPlainObject } from './util'

export function transformRequest(val: any): any {
  if (!isPlainObject(val)) {
    return val
  } else {
    return JSON.stringify(val)
  }
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
