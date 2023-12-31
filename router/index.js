const  Router = require('koa-router');
const user = require('./user/index.js');
const view = require('./view/index.js')
const goods = require('./goods/index.js');
const category = require('./category/index.js');
const upload = require('./upload/index.js')
const rule = require('./rule/index.js')
const menu = require('./menu/index.js')
const role = require('./role/index.js')
const managerUser = require('./managerUser/index.js')
const attribute = require('./attribute/index.js')

let router = new Router();

router.use('/api/user', user.routes())
router.use('/view', view.routes())
router.use('/api/goods', goods.routes())
router.use('/api/category', category.routes())
router.use('/api/upload', upload.routes())
router.use('/api/rule', rule.routes())
router.use('/api/menu', menu.routes())
router.use('/api/role', role.routes())
router.use('/api/managerUser', managerUser.routes())
router.use('/api/attribute', attribute.routes())

module.exports = router
