import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformReponse, transformRequest } from '../helpers/data'
import { processHeaders } from '../helpers/headers'
import flattenHeaders from '../helpers/flattenHeaders'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  console.log(config)
  processConfig(config)
  return xhr(config).then(res => transformResponseData(res))
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformResponseData(res: any): any {
  res.data = transformReponse(res.data)
  return res
}
