import { AxiosRequestConfig } from '../types'
import { processHeaders } from '../helpers/headers'
import { transformRequest, transformResponse } from '../helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',

  xsrfHeaderName: 'X-XSRF-TOKEN',

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  validateStatus(status: number) {
    return status >= 200 && status < 300
  },

  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],

  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
}

const methodsNodata = ['get', 'delete', 'head', 'options']

methodsNodata.forEach(item => {
  defaults.headers[item] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(item => {
  defaults.headers[item] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
