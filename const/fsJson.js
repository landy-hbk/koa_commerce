const fs = require('fs');

fs.readFile('./goods.json', 'utf-8', function(err, data) {
    let newData = JSON.parse(data);
    let pushData = [];

    // 过滤数据
    newData.map(v => {
        if(v.goods_name) {
            pushData.push(v)
        } 
    })

    // 生成新文件
    fs.writeFile('./newGoods.json', JSON.stringify(pushData), function(err) {
        if(err) console.log(err, '写入失败')
        else console.log('写入成功')
    })
})