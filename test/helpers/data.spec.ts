import { transformRequest, transformResponse } from '../../src/helpers/data'

describe('helpers:data', () => {
  describe('transformRequest', () => {
    test('should transform request data to string if data is a plainObject', () => {
      const a = { a: 1 }
      expect(transformRequest(a)).toBe('{"a":1}')
    })

    test('should do nothing if data is not a plainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(transformRequest(a)).toBe(a)
    })
  })

  describe('transformResponse', () => {
    test('should transform response data to object if data is a Json string', () => {
      const a = '{ "a": 1 }'
      expect(transformResponse(a)).toEqual({ a: 1 })
    })
    test('should do nothing if data is not a Json string', () => {
      const a = '{a: 1}'
      expect(transformResponse(a)).toBe('{a: 1}')
    })
  })
})
