import { buildURL, isURLSameOrigin } from '../../src/helpers/url'
import { combineURL, isAbsoluteURL } from '../../src/helpers/util'

describe('helpers:url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(buildURL('/foo', { name: 123 })).toBe('/foo?name=123')
    })

    test('should ignore if the param value is null', () => {
      expect(buildURL('/foo', { name: null })).toBe('/foo')
    })

    test('should support object params', () => {
      expect(
        buildURL('/foo', {
          person: {
            name: 123
          }
        })
      ).toBe('/foo?person=' + encodeURI('{"name":123}'))
    })

    test('should support date params', () => {
      const date = new Date()
      expect(buildURL('/foo', { date })).toBe('/foo?date=' + date.toISOString())
    })

    test('should support array params', () => {
      expect(buildURL('/foo', { arr: [1, 2] })).toBe('/foo?arr[]=1&arr[]=2')
    })

    test('should support special chart', () => {
      expect(
        buildURL('/foo', {
          c: '@:$+[]'
        })
      ).toBe('/foo?c=@:$+[]')
    })

    test('should support existing params', () => {
      expect(
        buildURL('/foo?name=1', {
          name: 2
        })
      ).toBe('/foo?name=1&name=2')
    })

    test('should correct discard url hash mark', () => {
      expect(
        buildURL('/foo?name=1#tag1', {
          age: 19
        })
      ).toBe('/foo?name=1&age=19')
    })

    test('should use serializer if provider', () => {
      const serializer = jest.fn(() => {
        return 'name=1'
      })
      const params = { age: 12 }
      expect(buildURL('/foo', params, serializer)).toBe('/foo?name=1')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    test('should support URLSearchParams', () => {
      expect(buildURL('/foo', new URLSearchParams('name=1'))).toBe('/foo?name=1')
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true or false', () => {
      expect(isAbsoluteURL('https://baidu.com')).toBeTruthy()
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })

  describe('combineUrl', () => {
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should not insert slash when relative url missing/empty', () => {
      expect(combineURL('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })

    test('should allow a single slash for relative url', () => {
      expect(combineURL('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect difference origin', () => {
      expect(isURLSameOrigin('http://baidu.com')).toBeFalsy()
    })
  })
})
