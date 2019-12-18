import Axios from './core/Axios'
import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import { extend } from './helpers/util'
import defaults from './core/defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import { isCancel } from './cancel/Cancel'

function createInstance(initConfig: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(initConfig)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function create(config: AxiosRequestConfig): AxiosInstance {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.isCancel = isCancel

export default axios
