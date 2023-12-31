import axios from 'axios'
import { networkConfig } from '/src/http/networkConfig'

// 创建 axios 实例
export function requestService(config) {
    const service = axios.create({
        // axios 中请求配置有 baseURL 选项，表示请求 URL 公共部分
        baseURL: networkConfig.serverUrl,
        // 超时
        timeout: networkConfig.requestTimeout
    })
    // request拦截器
    service.interceptors.request.use(config => {
        return config
    }, error => {
        console.log(error)
        Promise.reject(error)
    })

    // // 响应拦截器
    // service.interceptors.response.use(res => {
    //         // console.log(res)
    //     },
    //     error => {
    //         return Promise.reject(error)
    //     }
    // )
    return service(config)
}