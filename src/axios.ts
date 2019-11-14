import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './core/defaults'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context) // request 方法中有用到 this

  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
