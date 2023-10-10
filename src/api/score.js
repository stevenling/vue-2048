// import  serviceAxios  from "../http/http.js";
// const  serviceAxios  = require('../http/http')

import {requestService} from '/src/http/request'


// 插入数据
export function insertScoreApi(data) {
    return requestService({
        url: '/2048/insertScore',
        method: 'post',
        data: data,
        // transformRequest: [function(data) {
        //     let ret = ''
        //     for (let it in data) {
        //         ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        //     }
        //     return ret
        // }]
    })
}

// /**
//  * 获取排行榜
//  */
// export const getScoreRankApi = () => {
//     return serviceAxios({
//         url: '/app/getScoreRank',
//         method: "GET",
//     });
// };

// /**
//  * 插入分数
//  * 
//  * @param {*} data 
//  * @returns 
//  */
// export const insertScoreApi = (data) => {
//     return serviceAxios({
//         url: '/app/insertScore',
//         method: "POST",
//         data
//     });
// };