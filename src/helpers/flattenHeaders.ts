import { Method } from '../types'
import { deepMerge } from './util'

export default function flattenHeaders(headers: any, method: Method): any {
  headers = deepMerge(headers['common'] || {}, headers[method] || {}, headers)
  const deletekeys = ['delete', 'get', 'head', 'options', 'post', 'patch', 'put', 'common']
  deletekeys.forEach(key => {
    delete headers[key]
  })

  return headers
}
