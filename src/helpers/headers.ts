import { isPlainObject } from './util'

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

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return
  }
  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(':')
    key = key.toLocaleLowerCase().trim()
    if (!key) return
    if (value) {
      value = value.toLocaleLowerCase().trim()
    }
    parsed[key] = value
  })

  return parsed
}
