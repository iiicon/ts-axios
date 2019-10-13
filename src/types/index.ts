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
}
