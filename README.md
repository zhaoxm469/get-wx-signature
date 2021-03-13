# 说明

利用node获取微信签名的方法封装, 用于前端调用JS SDK初始化

## 安装

``` bash
npm install -S node-wx-signature
```

## 使用

``` js
const wxSignature = require('node-wx-signature')({
    appid: '换成您的appid',
    appsecret: '换成您的appsecret'
});

// 可以把通过路由把数据返回给前端
(async () => {

    // 获取调用 微信js sdk 的校验信息
    let sigData = await wxSignature.getSignature(url)

    // 验证消息的确来自微信服务器,开发者在微信后台管理配置消息地址提交信息后，微信服务器将发送GET请求到填写的服务器地址URL上，把这作为返回值返回给微信服务器即可
    let checkSignature = wxSignature.checkSignature(query);

})();
```
