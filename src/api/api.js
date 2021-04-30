import http from '../config/httpconfig'

/**
 * 根据Code获取用户信息 
 */
export const qeuryUserInfoByCode = params => http.post('/login/wxLogin', params);

/**
 * 查询所有设计方案
 */
export const listSculptureInfo = params => http.get('/sculpture/listSculptureInfo', params)

/**
 * 获取用户是否投标
 */
export const getUserVote = params => http.get('/sculptureUser/getUserVote', params)

/**
 * 用户提交投票
 */
export const userVote = params => http.post('/sculptureUser/userVote', params)

/**
 * 判断是否有查看统计权限
 */
export const isStatisticsAuth = params => http.get('/sculptureUser/isStatisticsAuth', params)

/**
 * 统计结果
 */
export const statisticsSculptureVote = params => http.get('/sculptureUser/statisticsSculptureVote', params)

//分享接口
export const getSign = params => http.get('/sculpture/getSign', params)
