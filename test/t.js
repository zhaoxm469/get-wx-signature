// JS 接口签名校验工具
// https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign


const sha1 = require('sha1');

let str = 'jsapi_ticket=LIKLckvwlJT9cWIhEQTwfNSyrIAg_xUVZJXwF8h4mnun-yGk-YfBMpRITO-2wq7b_SDDjbehLoiZMYTdRqc-Lw&noncestr=e6FJ4o66UOQjGmzx&timestamp=1615443464&url=http://dev.wechat.tyidian.nucarf.cn/_new/pages/test/index'

// 判断结果是否一致
console.log(sha1(str))