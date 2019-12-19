import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../helpers/util'

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config: any = {}
  const strats: any = {}
  for (let key in config2) {
    mergeField(key)
  }
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }
  const keysFromStratVal2 = ['url', 'method', 'data']
  keysFromStratVal2.forEach(key => {
    strats[key] = fromVal2Strat
  })

  const keysDeepStrat = ['headers', 'auth']
  keysDeepStrat.forEach(key => {
    strats[key] = deepMergeStrat
  })

  function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1
  }

  function fromVal2Strat(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
      return val2
    }
  }

  function deepMergeStrat(val1: any, val2: any): any {
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
