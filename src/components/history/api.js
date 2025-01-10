import { fetchType } from '../../api/constant';
import request from '../../utils/request';


export const addSession = async (data, port) => {
    try {
        const response = await request({
            baseUrl: 'http://10.98.193.46:5002',
            url: '/session/add',
            data,
            method: fetchType.post
        })

        return response.content;
    } catch (e) {
        return '后端算法还在优化中哦'
    }
}

