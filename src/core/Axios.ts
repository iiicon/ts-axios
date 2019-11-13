import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  // InterceptorManager,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import dispatchRequest from './dispatchRequst'
import InterceptorManager from './InterceptorManager'

interface Interceptor {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  interceptors: Interceptor

  constructor() {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    const chain: PromiseChain[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
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
