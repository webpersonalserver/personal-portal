const Router = require('koa-router');

const router = new Router();

// 模拟用户数据（后续替换为数据库查询）
const mockUser = {
  id: 1,
  username: 'admin',
  password: '123456',
  email: 'admin@example.com',
  avatar: null,
};

// 模拟 token 存储（后续替换为 JWT）
const tokenStore = new Map();

/**
 * 登录接口
 * POST /api/user/login
 * Body: { username, password }
 */
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  // 参数校验
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { code: 400, message: '用户名和密码不能为空', data: null };
    return;
  }

  // 验证用户（模拟）
  if (username !== mockUser.username || password !== mockUser.password) {
    ctx.status = 401;
    ctx.body = { code: 401, message: '用户名或密码错误', data: null };
    return;
  }

  // 生成 token（简单模拟，后续用 JWT 替换）
  const token = `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  tokenStore.set(token, mockUser.id);

  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      token,
      user: {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      },
    },
  };
});

/**
 * 登出接口
 * POST /api/user/logout
 * Header: Authorization: Bearer <token>
 */
router.post('/logout', async (ctx) => {
  const authHeader = ctx.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    tokenStore.delete(token); // 删除 token
  }

  ctx.body = {
    code: 0,
    message: '登出成功',
    data: null,
  };
});

/**
 * 获取用户信息接口
 * GET /api/user/profile
 * Header: Authorization: Bearer <token>
 */
router.get('/profile', async (ctx) => {
  const authHeader = ctx.headers.authorization;

  // 检查 token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { code: 401, message: '未登录', data: null };
    return;
  }

  const token = authHeader.slice(7);
  const userId = tokenStore.get(token);

  if (!userId) {
    ctx.status = 401;
    ctx.body = { code: 401, message: 'token 无效或已过期', data: null };
    return;
  }

  // 返回用户信息（不包含密码）
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      id: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
      avatar: mockUser.avatar,
    },
  };
});

module.exports = router;
