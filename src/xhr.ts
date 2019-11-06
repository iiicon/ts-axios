import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)

    Object.keys(headers).forEach(item => {
      if (data === null && item.toLocaleLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(item, headers[item])
      }
    })

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return
      if (request.status === 0) return // 网络错误

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = request.responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }

      handleResponse(response)
    }

    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status <= 304) {
        resolve(response)
      } else {
        reject(new Error(`Request failed with status code ${request.status}`))
      }
    }

    request.ontimeout = function() {
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
    }

    request.onerror = function handleError() {
      reject(new Error('Network Error'))
    }

    request.send(data)
  })
}
