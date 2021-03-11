"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cache = require('zxm-node-cache');
var sha1 = require('sha1');
var https_1 = __importDefault(require("https"));
var wxConfig = {
    appid: '',
    appsecret: ''
};
// 获取微信请求,重复代码封装
function getWxData(apiUrl, cacheKey) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheData, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheData = cache.get(cacheKey);
                    if (cacheData) {
                        return [2 /*return*/, cacheData];
                    }
                    return [4 /*yield*/, get(apiUrl)];
                case 1:
                    data = _a.sent();
                    cache.save(cacheKey, data, 7100);
                    return [2 /*return*/, data];
            }
        });
    });
}
// 获取accessToken
function getToken() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getWxData("/cgi-bin/token?grant_type=client_credential&appid=" + wxConfig.appid + "&secret=" + wxConfig.appsecret, 'app_asscess_token_data')];
        });
    });
}
// 获取jsapi_ticket
function getJsapi() {
    return __awaiter(this, void 0, void 0, function () {
        var access_token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getToken()];
                case 1:
                    access_token = (_a.sent()).access_token;
                    return [2 /*return*/, getWxData("/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi", 'app_jsapi_ticket_data')];
            }
        });
    });
}
// 获取随机字符串
var getNonceStr = function (length) {
    if (length === void 0) { length = 16; }
    var str = 'abcdefghijklmnopqrstuvwxyzABCKEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    // 取0-62的随机整数
    var max = str.length, min = 0;
    var randomStr = '';
    for (var i = 0; i < length; i++) {
        randomStr += str.substr(Math.floor(Math.random() * (max - min + 1)) + min, 1);
    }
    return randomStr;
};
// get请求封装
function get(path) {
    var options = {
        method: "GET",
        hostname: "api.weixin.qq.com",
        path: path,
    };
    return new Promise(function (resolve, reject) {
        var req = https_1.default.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                var body = Buffer.concat(chunks);
                var data = JSON.parse(body.toString());
                if (data.errcode) {
                    reject(data.errmsg);
                }
                else {
                    resolve(data);
                }
            });
        });
        req.end();
    });
}
module.exports = function (conf) {
    wxConfig = conf;
    return function (hostName) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket, nonceStr, timestamp, url, str, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getJsapi()];
                    case 1:
                        ticket = (_a.sent()).ticket;
                        nonceStr = getNonceStr();
                        timestamp = Math.round(new Date().getTime() / 1000);
                        url = hostName;
                        str = "jsapi_ticket=" + ticket + "noncestr=" + nonceStr + "timestamp=" + timestamp + "url=" + url;
                        signature = sha1(str);
                        return [2 /*return*/, {
                                signature: signature, nonceStr: nonceStr, timestamp: timestamp, url: url, appId: conf.appid, ticket: ticket
                            }];
                }
            });
        });
    };
};
