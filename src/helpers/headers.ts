import { deepMerge, isPlainObject } from './util'
import { Method } from '../types'

function normalizedName(headers: any, name: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(key => {
    if (key.toLocaleLowerCase() === name.toLocaleLowerCase()) {
      headers[name] = headers[key]
      delete headers[key]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizedName(headers, 'Content-Type')

  if (isPlainObject(data) && headers && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json;charset=utf-8'
  }

  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(': ')
    key = key.toLocaleLowerCase().trim()
    if (!key) return
    if (value) {
      value = value.trim()
    }
    parsed[key] = value
  })

  return parsed
}

export function flattenHeaders(headers: any, method: Method) {
  if (!headers) return headers
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodToDelete = ['delete', 'post', 'get', 'put', 'head', 'options', 'patch', 'common']
  methodToDelete.forEach(item => {
    delete headers[item]
  })

  return headers
}
