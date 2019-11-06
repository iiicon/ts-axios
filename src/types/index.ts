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

export interface AxiosRequestConfig {
  url: string
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

export interface AxiosRequestConfig {
  responseType?: XMLHttpRequestResponseType
}

export interface AxiosError {
  config: AxiosRequestConfig
  request?: any
  code?: number
  response?: AxiosResponse
  isAxiosError?: boolean
}
