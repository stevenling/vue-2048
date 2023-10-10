import {requestService} from '/src/http/request'

// 插入数据
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
export function getScoreRankApi() {
    return requestService({
        url: '/2048/getScoreRank',
        method: 'get',
    })
}