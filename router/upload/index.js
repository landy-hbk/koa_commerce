const Router  = require('koa-router');
let router = new Router();
const multer = require('koa-multer');

//配置
var storage = multer.diskStorage({
    //配置图片上传的目录
    destination: function (req, file, cb) {
        console.log('destination')
      cb(null, 'static/images/'); //注意路径必须存在
    },
    //图片上传完成重命名
    filename: function (req, file, cb) {
        console.log('filename')
      // 获取后缀名
      var fileFormat = file.originalname.split('.');
      cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    },
});
var upload = multer({ storage: storage });
router.post('/img', upload.single('file'), async ctx => {
    console.log(ctx.req.file, 'ctx.req.file')
    ctx.body = {
        code: 200, 
		data: {
            filename: ctx.req.file.filename,//返回文件名 
            path: ctx.req.file.destination + ctx.req.file.filename
        }
		
	} 
})


module.exports = router;