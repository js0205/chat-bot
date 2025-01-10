import request from '../utils/request';
import { fetchType } from './constant'
import axios from "axios"

export const fetchChatBot = async (data, port) => {
  try {
    const response = await request({
      baseUrl: 'http://10.98.193.46:' + port || "5002",
      url: '/generate',
      data,
      method: fetchType.post
    })

    return response.content;
  } catch (e) {
    return '后端算法还在优化中哦'
  }
}


export const uploadFile = (formData, config, port) => {
  const baseUrl = 'http://10.98.193.46:' + port || "5002";
  console.log("baseUrl", baseUrl)
  return new Promise((resolve) => {
    axios
      .post(`${baseUrl}/uploadFile`, formData, { ...config })
      .then((rs) => {
        resolve(rs);
      })
      .catch((rs) => resolve(rs));
  });
};