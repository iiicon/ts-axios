import axios from '../../src'
//
// axios({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hi'
//   }
// })
//
// axios.request({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hello'
//   }
// })
//
// axios.get('/extend/get')
//
// axios.options('/extend/options')
//
// axios.delete('/extend/delete')
//
// axios.head('/extend/head')
//
// axios.post('/extend/post', { msg: 'post' })
//
// axios.put('/extend/put', { msg: 'put' })
//
// axios.patch('/extend/patch', { msg: 'patch' })
//
// // 函数重载
// axios({
//   url: '/extend/post',
//   method: 'post',
//   data: {
//     msg: 'hi c'
//   }
// })
//
// axios('/extend/post', {
//   method: 'post',
//   data: {
//     msg: 'hi c'
//   }
// })

interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}

interface User {
  name: string
  age: number
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then((res: { data: any }) => res.data)
    .catch((err: any) => console.error(err))
}


async function test1() {
  const user = await getUser<User>()
  if (user) {
    console.log(user.result.name)
  }
}

test1()
