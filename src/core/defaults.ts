import { AxiosRequestConfig } from '../types'
import { transformReponse, transformRequest } from '../helpers/data'
import { processHeaders } from '../helpers/headers'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    common: {
      Accept: 'application/json, text/plain/, */*'
    }
  },
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformReponse(data)
    }
  ]
}

const methodNoData = ['get', 'head', 'options', 'delete']
methodNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodWWithData = ['post', 'put', 'patch']
methodWWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
