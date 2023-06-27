const  Router = require('koa-router');
const user = require('./user/index.js');
const view = require('./view/index.js')
const goods = require('./goods/index.js');
const category = require('./category/index.js');

let router = new Router();

router.use('/user', user.routes())
router.use('/view', view.routes())
router.use('/goods', goods.routes())
router.use('/category', category.routes())

module.exports = router
