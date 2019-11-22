import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

/**
 * config1 默认参数
 * config2 用户传入的参数
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  let config = Object.create(null)
  let strats = Object.create(null)

  const fromVal2Keys = ['url', 'data', 'params']
  fromVal2Keys.forEach(key => {
    strats[key] = fromVal2Strat
  })

  const fromDeepKeys = ['headers']
  fromDeepKeys.forEach(key => {
    strats[key] = fromDeepStrat
  })

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1
  }

  function fromVal2Strat(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
      return val2
    }
  }

  function fromDeepStrat(val1: any, val2: any): any {
    if (isPlainObject(val2)) {
      return deepMerge(val1, val2)
    } else if (typeof val2 !== 'undefined') {
      return val2
    } else if (isPlainObject(val1)) {
      return deepMerge(val1)
    } else if (typeof val1 !== 'undefined') {
      return val1
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
