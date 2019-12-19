import { isDate, isPlainObject, isURLSearchParams } from './util'

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string) {
  if (!params) return url
  const parts: string[] = []

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    Object.keys(params).forEach(key => {
      let val = params[key]
      if (val === null || typeof val === 'undefined') {
        return
      }

      let values: string[]
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach(value => {
        if (isDate(value)) {
          value = value.toISOString()
        } else if (isPlainObject(value)) {
          value = JSON.stringify(value)
        }
        parts.push(`${encode(key)}=${encode(value)}`)
      })
    })
  }
  serializedParams = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

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

const a = document.createElement('a')
const currentURL = resolveURL(window.location.href)

export function isURLOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return currentURL.protocol === parsedOrigin.protocol && currentURL.host === parsedOrigin.host
}

function resolveURL(url: string): URLOrigin {
  a.setAttribute('href', url)
  const { protocol, host } = a
  return { protocol, host }
}
