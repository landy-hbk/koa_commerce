const Router = require("koa-router");
const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

let router = new Router();

// 批量导入商品一级分类
router.get("/insertAllCategory/batchFile", async (ctx) => {
  fs.readFile("./const/category.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    let saveCount = 0;
    const Category = mongoose.model("Category");
    data.map((v) => {
      // 避免重复
      Category.findOne({ id: v.id })
        .exec()
        .then((result) => {
          if (!result) {
            const newCategory = new Category(v);
            newCategory
              .save()
              .then((res) => {
                saveCount++;
                console.log("保存成功------------", saveCount);
              })
              .catch((err) => {
                console.log("保存失败------------", err);
              });
          }
        });
    });
  });

  ctx.body = "开始导入分类";
});

// 批量导入商品二级分类
router.get("/insertAllCategorySub", async (ctx) => {
  fs.readFile("./const/categorySub.json", "utf8", function (err, data) {
    data = JSON.parse(data);
    let saveCount = 0;
    const CategorySub = mongoose.model("CategorySub");
    data.map((v) => {
      // 避免重复
      CategorySub.findOne({ id: v.id })
        .exec()
        .then((result) => {
          if (!result) {
            const newCategorySub = new CategorySub(v);
            newCategorySub
              .save()
              .then((res) => {
                saveCount++;
                console.log("保存成功------------", saveCount);
              })
              .catch((err) => {
                console.log("保存失败------------", err);
              });
          }
        });
    });
  });

  ctx.body = "开始导入二级分类";
});

// 添加一级分类
router.put("/insertCategory", async (ctx) => {
  await categoryUpdateMany(ctx, "add");
});
// 更新一级分类
router.post("/insertCategory", async (ctx) => {
  await categoryUpdateMany(ctx, "update");
});
// 删除
router.delete("/insertCategory/:id", async (ctx) => {
  await categoryUpdateMany(ctx, "delete");
});
// 添加二级分类
router.put("/insertCategorySubs", async (ctx) => {
  await categorySubsUpdateMany(ctx, "add");
});
// 修改二级分类
router.post("/insertCategorySubs", async (ctx) => {
    await categorySubsUpdateMany(ctx, "update");
});
// 删除二级分类
router.delete("/insertCategorySubs/:id", async (ctx) => {
    await categorySubsUpdateMany(ctx, "delete");
});

router.get("/insertCategorySubs", async (ctx) => {
  console.log("获取");
  await categorySubsUpdateMany(ctx, "query");
});
// 获取一级分类列表
router.get("/getCategoryList", async (ctx) => {
  const { category_id } = ctx.request.query;
  console.log(ctx.request.query, "ctx.request.query");
  const query = category_id ? { id: category_id } : {};
  const Category = mongoose.model("Category");
  const result = await Category.find(query).exec();

  console.log(result, "result");

  if (result) {
    ctx.body = {
      code: 200,
      data: result,
    };
  } else {
    ctx.body = {
      code: 500,
      message: err,
    };
  }
});

// 获取二级列表
router.get("/getCategorySubList", async (ctx) => {
  try {
    const CategorySub = mongoose.model("CategorySub");
    const mall_id = ctx.request.query.id;
    const result = await CategorySub.find({ mall_category_id: mall_id }).exec();

    console.log(result, "result");
    ctx.body = {
      code: 200,
      data: result,
    };
  } catch (err) {
    ctx.body = {
      code: 500,
      message: err,
    };
  }
});

// 获取所有分类
router.get("/getCategoryAllList", async (ctx) => {
  const Category = mongoose.model("Category");

  const result = await Category.aggregate([
    {
      $lookup: {
        from: "categorysubs",
        localField: "_id",
        foreignField: "category_id",
        as: "children",
      },
    },
  ]);

  if (result) {
    ctx.body = {
      code: 200,
      data: result,
    };
  }

  // console.log(result, 'result')
});

const categoryUpdateMany = async (ctx, type) => {
  const { mall_category_name, sort, id, category_id } = ctx.request.body;
  console.log(ctx.request.body, "insertCategory", type);
  const Category = mongoose.model("Category");
  const query = type === "update" ? { _id: category_id } : { id: id };
  let newCategoryObj = {
    mall_category_name: mall_category_name,
    sort: sort,
  };

  if (type === "add") {
    newCategoryObj.id = id;
    await Category.findOne(query).then(async (result) => {
      if (!result) {
        const newCategory = new Category(newCategoryObj);
        await newCategory
          .save()
          .then((res) => {
            console.log("保存成功------------", res);
            ctx.body = {
              code: 200,
              data: res,
            };
          })
          .catch((err) => {
            console.log("保存失败------------", err);
            ctx.body = {
              code: 500,
              data: err,
            };
          });
      } else {
        ctx.body = {
          code: 500,
          data: "存在重复的id键值",
        };
      }
    });
  }

  if (type === "update") {
    await Category.findOneAndUpdate(query, {
      $set: {
        ...newCategoryObj,
      },
    })
      .then((result) => {
        ctx.body = {
          code: 200,
          data: result,
        };
      })
      .catch((err) => {
        ctx.body = {
          code: 500,
          data: err,
        };
      });
  }

  if (type === "delete") {
    const id = ctx.params.id || "";
    if (!id) {
      ctx.body = {
        code: 500,
        message: "id不能为空！",
      };
    }
    console.log(id, "id", ctx.params);
    await Category.findOneAndRemove({ _id: id })
      .then((result) => {
        console.log(result, "result", typeof result);
        if (result) {
          ctx.body = {
            code: 200,
            message: "删除成功",
          };
        }
      })
      .catch((err) => {
        ctx.body = {
          code: 500,
          message: err,
        };
      });
  }
};

const categorySubsUpdateMany = async (ctx, type) => {
  //category_id 添加为父类id  更新为二级分类id
  const { mall_category_name, sort, id, category_id } = ctx.request.body;
  console.log(ctx.request.body, "insertCategory", type);
  const CategorySub = mongoose.model("CategorySub");
  const query = type === "update" ? { _id: category_id } : { id: id };
  let newCategoryObj = {
    mall_category_name: mall_category_name,
    sort: sort,
  };

  // 查询
  if (type === "query") {
    const { category_id } = ctx.request.query;
    await CategorySub.find({ _id: category_id }).then((result) => {
      if (result) {
        ctx.body = {
          code: 200,
          data: result,
        };
      } else {
        ctx.body = {
          code: 500,
          data: result,
        };
      }
    });
  }
  if (type === "add") {
    newCategoryObj.id = id;
    newCategoryObj.category_id = category_id;
    await CategorySub.findOne(query).then(async (result) => {
      if (!result) {
        const newCategory = new CategorySub(newCategoryObj);
        await newCategory
          .save()
          .then((res) => {
            console.log("保存成功------------", res);
            ctx.body = {
              code: 200,
              data: res,
            };
          })
          .catch((err) => {
            console.log("保存失败------------", err);
            ctx.body = {
              code: 500,
              data: err,
            };
          });
      } else {
        ctx.body = {
          code: 500,
          data: "存在重复的id键值",
        };
      }
    });
  }

  if (type === "update") {
    await CategorySub.findOneAndUpdate(query, {
      $set: {
        ...newCategoryObj,
      },
    })
      .then((result) => {
        ctx.body = {
          code: 200,
          data: result,
        };
      })
      .catch((err) => {
        ctx.body = {
          code: 500,
          data: err,
        };
      });
  }

  if (type === "delete") {
    const id = ctx.params.id || "";
    if (!id) {
      ctx.body = {
        code: 500,
        message: "id不能为空！",
      };
    }
    console.log(id,  ctx.params, "categorysubs-------------");
    await CategorySub.findOneAndRemove({ _id: id })
      .then((result) => {
        console.log(result, "result", typeof result);
        if (result) {
          ctx.body = {
            code: 200,
            message: "删除成功",
          };
        }
      })
      .catch((err) => {
        ctx.body = {
          code: 500,
          message: err,
        };
      });
  }
};

module.exports = router;
