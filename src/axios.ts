import Axios from './core/Axios'
import { AxiosRequestConfig, AxiosStatic } from './types'
import { extend } from './helpers/util'
import defaults from './core/defaults'

function createInstance(initConfig: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(initConfig)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

export default axios
