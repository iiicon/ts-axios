import axios, { AxiosTransformer } from '../../src'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123

axios({
  transformRequest: [
    function(data) {
      return qs.stringify(data)
    },
    ...axios.defaults.transformRequest as AxiosTransformer[]],
  transformResponse: [
    ...axios.defaults.transformResponse as AxiosTransformer[],
    function(data) {
      if (typeof data === 'object') {
        data.bbb = 2
      }
      return data
    }
  ],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  },
  headers: {
    test: 123
  }
}).then(res => {
  console.log(res.data)
})
