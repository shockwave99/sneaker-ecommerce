import axios from 'taro-axios';

const service = axios.create({
  baseURL: 'http://localhost:8080/'
})

service.interceptors.response.use(
  (resp) => resp.data.data,
  (err) => err
)

export const getSkuById = (skuId: string) => {
  return axios.get(
    `http://localhost:8080/product/sku/${skuId}`
  )
    .then(resp => resp.data.data)
    .catch(err => err)
}

export const getSkuByIdTest = (skuId: string) => {
  return axios.get(`product/sku/${skuId}`)
}
