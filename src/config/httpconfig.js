import axios from 'axios';
import { Toast } from 'antd-mobile';
import qs from 'qs';
import IP from './config';
import cookie from 'react-cookies';


let baseUrl = IP.host;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 3000000;

const instance = axios.create({
  xsrfCookieName: 'xsrf-token',
  baseURL: baseUrl,
  timeout: 3000000,
  responseType: 'json',
});

instance.interceptors.request.use({
  success(config) {
    return config;
  },
  error: error => {
    return Promise.reject(error);
  },
});

instance.interceptors.response.use(
  function (response) {
    cookie.save('token', response.headers['x-auth-token'])
    if (response.data.code !== 20000  && response.data.code !== 20031) {
      Toast.fail(response.data.message)
    }
    if (response.data.code === 20009) {
      cookie.remove('token', { path: '/' })
      window.location.href = '/'
    }
    // 3.其他失败，比如校验不通过等
    return Promise.resolve(response.data);
  },
  err => {
    Toast.fail('系统异常，请联系管理员！');
    return Promise.reject(err);
  }
);

export default {
  get(url, param) {
    return new Promise(resolve => {
      instance({
        method: 'get',
        url,
        params: param,
        headers: { 'x-auth-token': cookie.load("token") },
      }).then(res => {
        resolve(res);
      });
    }).catch((err) => { console.error(err) });
  },

  post(url, param) {
    return new Promise(resolve => {
      instance({
        method: 'post',
        url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': cookie.load("token")
        },
        data: qs.stringify(param),
      }).then(res => {
        resolve(res);
      }).catch((err) => { console.error(err) });
    });
  },

  jsonPost(url, param) {
    return new Promise(resolve => {
      instance({
        method: 'post',
        url,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': cookie.load("token")
        },
        data: param,
      }).then(res => {
        resolve(res);
      }).catch((err) => { console.error(err) });
    });
  },

  upload(url, param) {
    return new Promise((resolve) => {
      instance({
        method: 'post',
        url,
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': cookie.load("token") },
        data: param
      }).then(res => {
        resolve(res)
      }).catch(err => {
        console.error(err)
      })
    })
  },

  export(url, param, fileName) {
    return new Promise(resolve => {
      instance({
        method: 'get',
        url,
        params: param,
        responseType: 'blob',
      })
        .then(res => {
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
          const linkNode = document.createElement('a');
          linkNode.download = fileName; // a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); // 生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click(); // 模拟在按钮上的一次鼠标单击
          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
          // resolve('导出成功');
        })
        .catch(err => {
          console.error(err);
        });
    });
  },
};
