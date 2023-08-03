
const jwtWhiteList  = [
    /^\/api\/user\/login/,
    /^\/view/,
    /^\/static/,
    "/api/managerUser/login",
    "/api/goods/getGoodsDetailsInfo",
    "/api/upload/img"
]
module.exports = {
    jwtWhiteList
}