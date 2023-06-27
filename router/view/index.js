const Router  = require('koa-router');
const path = require('path');
const fs = require('fs');

let router = new Router();

// 返回静态html
router.get('/login', async (ctx) => {
    ctx.type = "html";
    const url = path.resolve(__dirname, '../../view/login.html')

    ctx.body = fs.readFileSync(url);   
})

router.get('/goods', async (ctx) => {
    ctx.type = "html";
    const url = path.resolve(__dirname, '../../view/goods.html')

    ctx.body = fs.readFileSync(url);   
})

router.get('/category', async (ctx) => {
    ctx.type = "html";
    const url = path.resolve(__dirname, '../../view/category.html')

    ctx.body = fs.readFileSync(url);   
})


module.exports = router;