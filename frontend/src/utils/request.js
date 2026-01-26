import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token，添加到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // code 为 0 表示成功
    if (res.code === 0) {
      return res.data;
    }
    // 业务错误
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // 可以在这里跳转登录页
    }
    return Promise.reject(error);
  }
);

export default request;
