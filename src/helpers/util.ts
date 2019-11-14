import { Method } from '../types'

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

export function isDate(val: any): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]'
}

export function isPlainObject(val: any): val is Object {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const i in from) {
    ;(to as T & U)[i] = from[i] as any
  }
  return to as T & U
}

export function deepMerge(...vals: any[]): any {
  const result = Object.create(null)
  vals.forEach(value => {
    if (value) {
      Object.keys(value).forEach(key => {
        const val = value[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }

    return result
  })
}

export function flattenHeaders(headers: any, method: Method) {
  if (!headers) return headers
  headers = deepMerge(headers.common, headers[method], headers)

  const methodToDelete = ['delete', 'post', 'get', 'put', 'head', 'options', 'patch', 'common']
  methodToDelete.forEach(item => {
    delete headers[item]
  })

  return headers
}
