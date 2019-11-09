import { head } from 'shelljs'

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'OPTIONS'
  | 'options'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'PATCH'
  | 'patch'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {
  // 这样的话，当 axios 返回的是 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosResponse 类型
  // TODO Promise
}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  request?: any
  code?: number
  response?: AxiosResponse
  isAxiosError?: boolean
}

export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise

  get(url: string, config?: AxiosRequestConfig): AxiosPromise

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise

  head(url: string, config?: AxiosRequestConfig): AxiosPromise

  options(url: string, config?: AxiosRequestConfig): AxiosPromise

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
}

export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise
  (url: string, config?: AxiosRequestConfig): AxiosPromise
}

// 请求接口数据
export interface ResponseData<T = any> {
  /**
   * 状态码
   * @type { number }
   */
  code: number
  /**
   * 数据
   * @type { T }
   */
  result: T
  /**
   * 消息
   * @type { string }
   */
  message: string
}
