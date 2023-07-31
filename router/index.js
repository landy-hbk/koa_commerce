const  Router = require('koa-router');
const user = require('./user/index.js');
const view = require('./view/index.js')
const goods = require('./goods/index.js');
const category = require('./category/index.js');
const upload = require('./upload/index.js')
const rule = require('./rule/index.js')
const menu = require('./menu/index.js')

let router = new Router();

router.use('/api/user', user.routes())
router.use('/view', view.routes())
router.use('/api/goods', goods.routes())
router.use('/api/category', category.routes())
router.use('/api/upload', upload.routes())
router.use('/api/rule', rule.routes())
router.use('/api/menu', menu.routes())

module.exports = router
