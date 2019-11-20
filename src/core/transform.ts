import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any = {},
  fns: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) return data
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    fn(data, headers)
  })

  return data
}
