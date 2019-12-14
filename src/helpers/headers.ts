import { isPlainObject } from './util'

function normalizeHeaderName(headers: any, name: string): void {
  Object.keys(headers).forEach(item => {
    if (item.toLocaleLowerCase() === name.toLocaleLowerCase()) {
      headers[name] = headers[item]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) return parsed

  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(':')
    key = key.trim().toLocaleLowerCase()
    if (!key) return
    if (value) {
      value = value.trim()
    }
    parsed[key] = value
  })

  return parsed
}
