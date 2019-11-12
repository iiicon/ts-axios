import { ResponseData, AxiosPromise, AxiosResponse } from '../../src/types'
import axios from '../../src'

interface User {
  name: string,
  age: number
}

function getUser<T>() {
  return axios
    .get<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(err => console.error(err))
}

async function test() {
  const user = await getUser<User>()
  if (user) {
    console.log(user.result)
  }
}

test()