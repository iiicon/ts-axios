import { createAxiosError, AxiosError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helpers:error', () => {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: null,
      request,
      config,
      data: {
        foo: 'bar'
      }
    }
    const error = createAxiosError('error!!!!!!', config, '600', request, response)
    expect(error instanceof Error)
    expect(error.message).toBe('error!!!!!!')
    expect(error.config).toEqual({ method: 'post' })
    expect(error.code).toBe('600')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
