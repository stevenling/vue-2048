import { requestService } from '/src/http/request'

/**
 * 插入分数
 * 
 * @param {*} data 数据 
 * @returns 
 */
export function insertScoreApi(data) {
    return requestService({
        url: '/2048/insertScore',
        method: 'post',
        data: data,
    })
}

/**
 * 获取排行榜
 */
export function getScoreRankApi(data) {
    return requestService({
        url: '/2048/getScoreRank',
        method: 'post',
        data: data
    })
}