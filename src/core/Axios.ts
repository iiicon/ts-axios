import { AxiosRequestConfig, AxiosPromise, Method } from '../types'
import dispatchRequest from './dispatchRequst'

export default class Axios {
  // request(config: AxiosRequestConfig): AxiosPromise {
  //   return dispatchRequest(config)
  // }
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMthodWithoutData('delete', url)
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMthodWithoutData('get', url)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMthodWithoutData('head', url)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMthodWithoutData('options', url)
  }

  post(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMthodWithData('post', url, data)
  }

  patch(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMthodWithData('patch', url, data)
  }

  put(url: string, data: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMthodWithData('put', url, data)
  }

  _requestMthodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return dispatchRequest(Object.assign(config || {}, { method, url }))
  }

  _requestMthodWithData(method: Method, url: string, data: any, config?: AxiosRequestConfig) {
    return dispatchRequest(Object.assign(config || {}, { method, url, data }))
  }
}
