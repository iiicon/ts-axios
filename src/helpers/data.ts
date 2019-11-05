import { isPlainObject } from './util'

export function transformRequest(val: any): any {
  if (isPlainObject(val)) {
    return JSON.stringify(val)
  }
  return val
}
