const getWxSign = require('../index')({
    appid: '换成您的appid',
    appsecret: '换成您的appsecret'
});

(async()=>{
    let data = await getWxSign('baidu.con');
    console.log(data)
})();