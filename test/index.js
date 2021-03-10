const getWxSign = require('../index')({
    appid: 'wx5e6f4585c269088a',
    appsecret: '2e0d3b8ba965555791f969662795668e'
});

(async()=>{
    let data = await getWxSign('baidu.con');
    console.log(data)
})();