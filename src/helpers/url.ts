import { isDate } from './util'
import { isObject } from './util'

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
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    // params: {
    //  date
    // }
    values.forEach(item => {
      if (isDate(item)) {
        item = item.toISOString()
      } else if (isObject(item)) {
        // params: {
        //  object
        // }
        item = JSON.stringify(item)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
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
