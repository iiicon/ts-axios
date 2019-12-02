import { isDate, isPlainObject, isURLSearchParams } from './util'

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

interface URLOrigin {
  protocol: string
  host: string
}

function resolveURL(url: string): URLOrigin {
  const parseNode = document.createElement('a')
  parseNode.href = url
  const { protocol, host } = parseNode

  return { protocol, host }
}

export function buildURL(
  url: string,
  params: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    let parts: string[] = []
    Object.keys(params).forEach(key => {
      let val = params[key]

      if (val === null || typeof val === 'undefined') {
        return // ?
      }
      let values: string[]
      if (!Array.isArray(val)) {
        values = [val]
      } else {
        values = val
        key += '[]'
      }
      values.forEach(item => {
        // tslint:disable-next-line:no-constant-condition
        if (isDate(item)) {
          item = item.toISOString()
          // tslint:disable-next-line:no-constant-condition
        } else if (isPlainObject(item)) {
          item = JSON.stringify(item)
        }
        parts.push(`${encode(key)}=${encode(item)}`)
      })
    })

    serializedParams = parts.join('&')
  }

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

export function isURLSameOrigin(requestURL: string): boolean {
  const parseOrigin = resolveURL(requestURL)
  const currentOrigin = resolveURL(window.location.href)

  return parseOrigin.protocol === currentOrigin.protocol && parseOrigin.host === currentOrigin.host
}
