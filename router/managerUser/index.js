const Router = require("koa-router");
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
let router = new Router();

router.post("/login", async (ctx) => {
	const userName = ctx.request.body.userName;
	const passWord = ctx.request.body.passWord;

	// 引入user模型
	const ManagerUser = mongoose.model("ManagerUser");

	await ManagerUser.findOne({ userName: userName })
		.exec()
		.then(async (result) => {
			// console.log('result', result)
			// 如果用户名存在
			if (result) {
				let newUser = new ManagerUser();
				await newUser
					.comparePassword(passWord, result.hashPassword)
					.then((isMatch) => {
						if (isMatch) {
							// 生成token
							const token = jwt.sign({ userName: result.userName }, "secret", {
								expiresIn: "2h",
							});
							ctx.body = {
								code: 200,
								message: isMatch,
								data: {
									token: token,
									uid: result._id,
								},
							};
						} else {
							ctx.body = {
								code: 500,
								message: isMatch,
							};
						}
					});
			} else {
				ctx.body = {
					code: 500,
					message: "用户名不存在！",
				};
			}
		})
		.catch((err) => {
			ctx.body = {
				code: 500,
				message: err,
			};
		});
});

router.get("/managerUserList", async (ctx) => {
	await managerUserSQL(ctx, "query");
});
// 添加菜单数据
router.post("/managerUserList", async (ctx) => {
	await managerUserSQL(ctx, "add");
});

// 修改菜单数据
router.put("/managerUserList", async (ctx) => {
	await managerUserSQL(ctx, "update");
});

// 删除数据
router.delete("/managerUserList/:id", async (ctx) => {
	await managerUserSQL(ctx, "delete");
});

const managerUserSQL = async (ctx, type) => {
	const { userName, sex, role_id, role_name, passWord, nikeName, isBlack, notes, id } = ctx.request.body;
	let menuObj = {
		userName,
		sex,
		role_id,
		passWord,
		nikeName,
		isBlack,
		role_name,
		notes,
	};

	const ManagerUser = mongoose.model("ManagerUser");

	if (type === "query") {
		const { id } = ctx.request.query;
		const query = id ? { _id: id } : {};
		await ManagerUser.find(query)
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
		const newMenu = new ManagerUser(menuObj);
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
		await ManagerUser.findOneAndUpdate(
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
	} else if (type === "delete") {
		const id = ctx.params.id || "";
		if (!id) {
			ctx.body = {
				code: 500,
				message: "id不能为空！",
			};
		}
		await ManagerUser.findOneAndRemove({ _id: id })
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
