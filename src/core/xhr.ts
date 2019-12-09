import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createAxiosError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { cookie } from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfHeaderName,
      xsrfCookieName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    function processHeaders() {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(item => {
        if (data === null && item.toLocaleLowerCase() === 'content-type') {
          delete headers[item]
        } else {
          request.setRequestHeader(item, headers[item])
        }
      })
    }

    function processCancel() {
      if (cancelToken) {
        cancelToken.promise
          .then(message => {
            request.abort()
            reject(message)
          })
          .catch(
            /* istanbul ignore next */
            () => {
              // do nothing
            }
          )
      }
    }

    function addEvents() {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) return
        if (request.status === 0) return // 网络错误

        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          request.responseType === 'text' ? request.responseText : request.response
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

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }

      request.ontimeout = function() {
        reject(
          createAxiosError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request)
        )
      }

      request.onerror = function handleError() {
        reject(createAxiosError('Network Error', config, null, request))
      }
    }

    function configureRequest() {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = true
      }
    }

    // tslint:disable-next-line:no-inner-declarations
    function handleResponse(response: AxiosResponse) {
      if (!validateStatus || validateStatus(response.status)) {
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

    request.send(data)
  })
}
