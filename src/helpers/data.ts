import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  // 对于 formData ArrayBuffer 等，我们不做处理
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformReponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }

  return data
}
