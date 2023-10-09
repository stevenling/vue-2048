import  serviceAxios  from "../http/http.js";
// const  serviceAxios  = require('../http/http')

/**
 * 获取排行榜
 */
export const getScoreRankApi = () => {
    return serviceAxios({
        url: '/app/getScoreRank',
        method: "GET",
    });
};

/**
 * 插入分数
 * 
 * @param {*} data 
 * @returns 
 */
export const insertScoreApi = (data) => {
    return serviceAxios({
        url: '/app/insertScore',
        method: "POST",
        data
    });
};