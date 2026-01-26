import request from '@/utils/request';

// 登录
export function login(data) {
  return request.post('/user/login', data);
}

// 登出
export function logout() {
  return request.post('/user/logout');
}

// 获取用户信息
export function getUserProfile() {
  return request.get('/user/profile');
}
