# 说明

利用node获取微信签名的方法封装, 用于前端调用JS SDK初始化

## 安装

``` bash
npm install -S get-wx-signature
```

## 使用

``` js
const getWxSignature = require('get-wx-signature')({
    appid: '换成您的appid',
    appsecret: '换成您的appsecret'
});

// 实际工作中，可以把通过路由把数据返回给前端
(async () => {
    // getWxSignature 接收一个参数，参数为必填项（前端路由地址 ）
    // return object 对象
    console.log(await getWxSignature('http://www.baidu.com'))

    // 返回的数据
    // {
    //     signature: '996dbfc72be8c037bf227fecaa1d734ba68e13e3',
    //     nonceStr: '4zOA4iNFwwXejepo',
    //     timestamp: 1615393717,
    //     url: 'http://www.baidu.com',
    //     appId: 'wx5e6f4585c269088a'
    // }
})();
```
