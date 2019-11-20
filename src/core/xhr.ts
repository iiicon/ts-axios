import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createAxiosError } from '../helpers/error'

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

    request.open(method.toUpperCase(), url!, true)

    Object.keys(headers).forEach(item => {
      if (data === null && item.toLocaleLowerCase() === 'content-type') {
        delete headers[item]
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

    // tslint:disable-next-line:no-inner-declarations
    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status <= 304) {
        resolve(response)
      } else {
        reject(
          createAxiosError(
            `Request failed with status code ${request.status}`,
            config,
            response.statusText,
            request,
            response
          )
        )
      }
    }

    request.ontimeout = function() {
      reject(createAxiosError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    request.onerror = function handleError() {
      reject(createAxiosError('Network Error', config, null, request))
    }

    request.send(data)
  })
}
