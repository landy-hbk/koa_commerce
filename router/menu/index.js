const Router = require("koa-router");
const { default: mongoose } = require("mongoose");
let router = new Router();

router.get("/menulist", async (ctx) => {
	await menuSQL(ctx, "query");
});
// 添加菜单数据
router.post("/menulist", async (ctx) => {
	await menuSQL(ctx, "add");
});

// 修改菜单数据
router.put("/menulist", async (ctx) => {
	await menuSQL(ctx, "update");
});

// 删除数据
router.delete("/menulist/:id", async (ctx) => {
	await menuSQL(ctx, "delete");
});

const menuSQL = async (ctx, type) => {
	const { menu_name, menu_path, component, parent_id, id } = ctx.request.body;
	let menuObj = {
		menu_name,
		menu_path,
		component,
		parent_id,
	};

	const Menu = mongoose.model("Menu");

	if (type === "query") {
		const { menu_id } = ctx.request.query;
		const query = menu_id ? { menu_id: menu_id } : {};
		await Menu.find(query)
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
		const newMenu = new Menu(menuObj);
		await newMenu
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
		await Menu.findOneAndUpdate(
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
		await Menu.findOneAndRemove({ _id: id })
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
