const Router  = require('koa-router');
const path = require('path');
const fs = require('fs');
const { default: mongoose } = require('mongoose');

let router = new Router();

// 批量导入商品一级分类
router.get('/insertAllCategory', async (ctx) => {
   fs.readFile('./const/category.json', 'utf8', function(err, data) {
     data = JSON.parse(data);
     let saveCount = 0;
     const Category = mongoose.model('Category'); 
     data.map(v => {
        // 避免重复
        Category.findOne({id: v.id}).exec().then(result => {
            if(!result) {
                const newCategory = new Category(v);
                newCategory.save().then(res => {
                    saveCount++;
                    console.log('保存成功------------', saveCount)
                }).catch(err => {
                    console.log('保存失败------------', err)
                })
            }
        })
     })
   })

   ctx.body = '开始导入分类'
})

// 批量导入商品二级分类
router.get('/insertAllCategorySub', async (ctx) => {
    fs.readFile('./const/categorySub.json', 'utf8', function(err, data) {
      data = JSON.parse(data);
      let saveCount = 0;
      const CategorySub = mongoose.model('CategorySub'); 
      data.map(v => {
         // 避免重复
         CategorySub.findOne({id: v.id}).exec().then(result => {
             if(!result) {
                 const newCategorySub = new CategorySub(v);
                 newCategorySub.save().then(res => {
                     saveCount++;
                     console.log('保存成功------------', saveCount)
                 }).catch(err => {
                     console.log('保存失败------------', err)
                 })
             }
         })
      })
    })
 
    ctx.body = '开始导入二级分类'
 })

// 获取一级分类列表
 router.get('/getCategoryList', async ctx => {
    try {
        const Category = mongoose.model('Category');
        const result = await Category.find().exec();

        console.log(result, 'result')
        ctx.body = {
            code: 200,
            data: result,
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            message: err,
        }
    }
    
 })

 router.get('/getCategorySubList', async ctx => {
    try {
        const CategorySub = mongoose.model('CategorySub');
        const mall_id = ctx.request.query.id;
        const result = await CategorySub.find({ mall_category_id: mall_id }).exec();

        console.log(result, 'result')
        ctx.body = {
            code: 200,
            data: result,
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            message: err,
        }
    }
    
 })


module.exports = router;