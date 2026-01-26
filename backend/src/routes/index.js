const Router = require('koa-router');
const userRouter = require('./user');

const router = new Router({ prefix: '/api' });

// 健康检查
router.get('/health', async (ctx) => {
  ctx.body = {
    code: 0,
    message: 'success',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  };
});

// 注册子路由（后续新增路由在此添加）
router.use('/user', userRouter.routes(), userRouter.allowedMethods());
// router.use('/article', articleRouter.routes(), articleRouter.allowedMethods());
// router.use('/category', categoryRouter.routes(), categoryRouter.allowedMethods());

module.exports = router;
