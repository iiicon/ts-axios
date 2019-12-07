import { cookie } from '../../src/helpers/cookie'

describe('helper:cookie', () => {
  test('should read cookies', () => {
    document.cookie = 'a=b'
    expect(cookie.read('a')).toBe('b')
  })

  test('should return null if cookie is not exist', () => {
    document.cookie = 'c=d'
    expect(cookie.read('aaa')).toBeNull()
  })
})
