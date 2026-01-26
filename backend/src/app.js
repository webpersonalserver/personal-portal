const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
require('dotenv').config();

const router = require('./routes');

const app = new Koa();

// 中间件
app.use(cors());
app.use(bodyParser());

// 注册路由
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
