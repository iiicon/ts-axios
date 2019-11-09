export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

export function isDate(val: any): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]'
}

export function isPlainObject(val: any): val is Object {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const i in from) {
    ;(to as T & U)[i] = from[i] as any
  }
  return to as T & U
}
