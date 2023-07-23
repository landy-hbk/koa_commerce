
const jwtWhiteList  = [
    /^\/api\/user\/login/,
    /^\/view/,
    /^\/static/,
    "/api/goods/getGoodsDetailsInfo",
    "/api/upload/img"
]
module.exports = {
    jwtWhiteList
}