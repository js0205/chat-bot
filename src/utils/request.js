import { message } from 'antd';
import Cookies from 'js-cookie';

// const BASE_URL = 'http://10.98.193.23:2226';
// target: 'http://10.98.193.23:5002',

const request = async (options) => {
  const { url, baseUrl, method, data, headers = {}, type = '' } = options;
  const username = Cookies.get('user');

  let newData = undefined;
  const isFile = type === 'file';

  if (isFile) {
    newData = data;
  } else {
    newData = typeof data === 'object' ? JSON.stringify(data) : data;
  }

  try {
    const response = await fetch(`${baseUrl}${url}`, {
      method,
      body: newData,
      headers: {
        'X-Username': username,
        ...headers,
      },
    });

    if (response.ok) {
      // 判断是否为文件类型
      return isFile ? await response.blob() : await response.json();
    } else {
      message.error('请求出错了');
      return Promise.reject();
    }
  } catch (e) {
    message.error('请求出错了');
    return Promise.reject();
  }
};





export function setLocalStorageWithExpiration(key, value, expirationMinutes) {
  const expirationMS = expirationMinutes * 60 * 1000;
  const record = { value: value, expiration: new Date().getTime() + expirationMS };
  localStorage.setItem(key, JSON.stringify(record));
}

export function getLocalStorageWithExpiration(key) {
  const record = JSON.parse(localStorage.getItem(key));
  if (!record) {
    return null;
  }
  if (new Date().getTime() > record.expiration) {
    localStorage.removeItem(key);
    return null;
  }
  return record.value;
}




export default request;
