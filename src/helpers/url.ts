import { isDate, isPlainObject } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params: any): string {
  if (!params) {
    return url
  }
  let parts: string[] = []
  Object.keys(params).forEach(key => {
    let val = params[key]

    if (val === null || typeof val === 'undefined') {
      return // ?
    }

    // params: {
    //   key: val:[]
    // }
    let values: string[]
    if (!Array.isArray(val)) {
      values = [val]
    } else {
      values = val
      key += '[]'
    }

    // params: {
    //  date
    // }
    values.forEach(item => {
      // tslint:disable-next-line:no-constant-condition
      if (isDate(item)) {
        item = item.toISOString()
        // tslint:disable-next-line:no-constant-condition
      } else if (isPlainObject(item)) {
        // params: {
        //  object
        // }
        item = JSON.stringify(item)
      }
      parts.push(`${encode(key)}=${encode(item)}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    // #
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex)
    }
    url += (url.indexOf('?') !== -1 ? '&' : '?') + serializedParams
  }

  return url
}
