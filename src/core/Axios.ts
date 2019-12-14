import {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  RejectedFn,
  ResolvedFn
} from '../types'
import dispatchRequest from './dispatchRequest'
import { InterceptorManager } from './InterceptorManager'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  interceptors: Interceptors

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
      let { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config: AxiosRequestConfig): AxiosPromise {
    return _requestMethodWithoutData('get', url, config)
  }

  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return _requestMethodWithoutData('head', url, config)
  }

  options(url: string, config: AxiosRequestConfig): AxiosPromise {
    return _requestMethodWithoutData('options', url, config)
  }

  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return _requestMethodWithoutData('delete', url, config)
  }

  post(url: string, data: any, config: AxiosRequestConfig): AxiosPromise {
    return _requestMethodWithData('post', url, data, config)
  }

  put(url: string, data: any, config: AxiosRequestConfig): AxiosPromise {
    return _requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data: any, config: AxiosRequestConfig): AxiosPromise {
    return _requestMethodWithData('patch', url, data, config)
  }
}

function _requestMethodWithoutData(
  method: Method,
  url: string,
  config: AxiosRequestConfig
): AxiosPromise {
  return dispatchRequest(Object.assign(config || {}, { url, method }))
}

function _requestMethodWithData(
  method: Method,
  url: string,
  data: any,
  config: AxiosRequestConfig
): AxiosPromise {
  return dispatchRequest(Object.assign(config || {}, { method, url, data }))
}
