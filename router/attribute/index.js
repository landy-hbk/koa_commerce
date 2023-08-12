const Router = require("koa-router");
const path = require("path");
const { default: mongoose } = require("mongoose");
const AttributeKey = require('../../database/schema/AttributeKey')
const AttributeValue = require('../../database/schema/AttributeValue')

let router = new Router();

// 获取sku属性键值列表
router.get("/attributeKey", async (ctx) => {
	await AttributeKeySQL(ctx, "query");
});
// 添加sku属性键值
router.post("/attributeKey", async (ctx) => {
	await AttributeKeySQL(ctx, "add");
});

// 修改获取sku属性键值
router.put("/attributeKey", async (ctx) => {
	await AttributeKeySQL(ctx, "update");
});

// 删除获取sku属性键值
router.delete("/attributeKey/:id", async (ctx) => {
	await AttributeKeySQL(ctx, "delete");
});

const AttributeKeySQL = async (ctx, type) => {
	const { category_id, attribute_key_id, attribute_key_name,  id } = ctx.request.body;
	let menuObj = {
		category_id,
		attribute_key_id,
		attribute_key_name,
	};

	// const Menu = mongoose.model("Menu");

	if (type === "query") {
		const { id } = ctx.request.query;
		const query = id ? { id: id } : {};
		await AttributeKey.find(query)
			.then((result) => {
				ctx.body = {
					code: 200,
					data: result,
				};
			})
			.catch((err) => {
				ctx.body = {
					code: 500,
					message: err,
				};
			});
	} else if (type === "add") {
		const newAttributeKey = new AttributeKey(menuObj);
		await newAttributeKey
			.save()
			.then((res) => {
				// console.log("保存成功！------", res);
				ctx.body = {
					code: 200,
					message: "添加成功",
				};
			})
			.catch((err) => {
				// console.log("保存失败！------", err);
				ctx.body = {
					code: 500,
					message: "添加失败" + err,
				};
			});
	} else if (type === "update") {
		await AttributeKey.findOneAndUpdate(
			{ _id: id },
			{
				$set: {
					...menuObj,
				},
			}
		)
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
	} else if (type === 'delete') {
		const id = ctx.params.id || "";
		if (!id) {
			ctx.body = {
				code: 500,
				message: "id不能为空！",
			};
		}
		await AttributeKey.findOneAndRemove({ _id: id })
			.then((result) => {
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