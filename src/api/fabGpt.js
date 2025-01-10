import request from '../utils/request';
import { fetchType } from './constant'

export const fetchUploadImage = async (data) => {
  try {
    const response = await request({
      baseUrl: 'http://10.98.193.46:2226',
      url: '/uploadImage',
      data,
      type: 'file',
      method: fetchType.post,
    })

    return response;
  } catch(e) {
    return '后端算法还在优化中哦'
  }
}

export const fetchUploadMessage = async(data) => {
  try {
    const response = await request({
      baseUrl: 'http://10.98.193.46:2226',
      url: '/uploadMessage',
      data,
      method: fetchType.post
    })

    return response.message;
  } catch(e) {
    return '后端算法还在优化中哦'
  }
}