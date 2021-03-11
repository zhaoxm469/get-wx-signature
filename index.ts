const cache = require('zxm-node-cache')
const sha1 = require('sha1');
import http from "https";

interface wxConfig {
    appid: string
    appsecret: string
}

let wxConfig: wxConfig = {
    appid:'',
    appsecret:''
};

// 获取微信请求,重复代码封装
async function getWxData(apiUrl: string, cacheKey: string) {
    let cacheData = cache.get(cacheKey);
    if (cacheData) {
        return cacheData;
    }

    let data = await get(apiUrl);
    cache.save(cacheKey, data, 7100)
    return data;
}

// 获取accessToken
async function getToken() {
    return getWxData(`/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.appid}&secret=${wxConfig.appsecret}`, 'app_asscess_token_data')
}

// 获取jsapi_ticket
async function getJsapi() {
    let { access_token } = await getToken();
    return getWxData(`/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`, 'app_jsapi_ticket_data')
}

// 获取随机字符串
const getNonceStr = (length = 16) => {
    let str = 'abcdefghijklmnopqrstuvwxyzABCKEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    // 取0-62的随机整数
    let max = str.length,
        min = 0
    let randomStr = ''
    for (let i = 0; i < length; i++) {
        randomStr += str.substr(Math.floor(Math.random() * (max - min + 1)) + min, 1)
    }
    return randomStr
}

// get请求封装
function get(path: any) {
    const options = {
        method: "GET",
        hostname: "api.weixin.qq.com",
        path: path,
    };

    return new Promise((resolve,reject) => {

        const req = http.request(options, function (res:any) {
            const chunks : any = [];

            res.on("data", function (chunk: any) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                let data = JSON.parse(body.toString());
                if (data.errcode) {
                    reject(data.errmsg);
                }else{
                    resolve(data);
                }
            });
        });

        req.end();
    })
}



module.exports = function (conf: wxConfig) {

    wxConfig = conf;

    return async function (hostName: any) {
        // 微信服务器通讯,获取ticket
        let { ticket } = await getJsapi();

        // 随机数
        let nonceStr = getNonceStr()
        // 时间戳
        let timestamp = Math.round(new Date().getTime() / 1000)
        // 前端传递的URL
        let url = hostName
        // 对四个数据做字典序的排序
        let str = `jsapi_ticket=${ticket}noncestr=${nonceStr}timestamp=${timestamp}url=${url}`
        // 使用sha1第三方模块进行加密得到的就是签名
        let signature = sha1(str)

        return {
            signature, nonceStr, timestamp, url, appId: conf.appid, ticket
        }
    }
}