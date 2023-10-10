// import axios, { AxiosResponse } from 'axios'
// import { ElLoading, ElMessage } from 'element-plus'

// // 创建 axios 请求实例
// const serviceAxios = axios.create({
//     // 测试
//     // baseURL: "http://localhost:8090/api/",
//     // 正式
//     baseURL: "http://yunhu.wiki:2048/api/",
//     // baseURL: "http://localhost:8090/api/", // 基础请求地址
//     // baseURL: '/api',
//     timeout: 10000, // 请求超时设置
//     withCredentials: false, // 跨域请求是否需要携带 cookie
// });

// /**
//  * 响应拦截
//  */
// serviceAxios.interceptors.response.use(res => {
//     // 我们一般在这里处理，请求成功后的错误状态码 例如状态码是500，404，403
//     // res 是所有相应的信息
//     return Promise.resolve(res)
// }, (error) => {
//     let message = "";
//     console.log('响应拦截：', error);
//     if (error && error.response) {
//         switch (error.response.status) {
//             case 302:
//                 message = "接口重定向了！";
//                 break;
//             case 400:
//                 message = "参数不正确！";
//                 break;
//             case 401:
//                 message = "您未登录，或者登录已经超时，请先登录！";
//                 break;
//             case 403:
//                 message = "您没有权限操作！";
//                 break;
//             case 404:
//                 message = `请求地址出错: ${error.response.config.url}`;
//                 break;
//             case 408:
//                 message = "请求超时！";
//                 break;
//             case 409:
//                 message = "系统已存在相同数据！";
//                 break;
//             case 500:
//                 message = "服务器内部错误！";
//                 break;
//             case 501:
//                 message = "服务未实现！";
//                 break;
//             case 502:
//                 message = "网关错误！";
//                 break;
//             case 503:
//                 message = "服务不可用！";
//                 break;
//             case 504:
//                 message = "服务暂时无法访问，请稍后再试！";
//                 break;
//             case 505:
//                 message = "HTTP 版本不受支持！";
//                 break;
//             default:
//                 message = "异常问题，请联系管理员！";
//                 break;
//         }
//     }
//     Promise.reject(error).then(r => ElMessage.error(error.response.status));
// });


// /**
//  * post 请求
//  *
//  * @param config
//  * @returns {Promise<AxiosResponse<any>>}
//  */
// export const post = config => {
//     return serviceAxios({
//         ...config,
//         method: "post",
//         data: config.data
//     })
// }


// /**
//  * get 请求
//  *
//  * @param config
//  * @returns {Promise<AxiosResponse<any>>}
//  */
// export const get = config => {
//     return serviceAxios({
//         ...config,
//         method: "get",
//         data: config.data
//     })
// }

// // 导出给 main.js 挂载
// export default serviceAxios;