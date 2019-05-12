"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
exports.__esModule = true;
var rp = require("request-promise");
var selenium_webdriver_1 = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
var PornHub = /** @class */ (function () {
    function PornHub() {
        this.videoURL = 'https://www.pornhub.com/view_video.php?viewkey=';
        this.videoSearchBaseURL = 'http://www.pornhub.com/webmasters/search';
        this.cacheVideo = new Map();
    }
    PornHub.prototype.search = function (option) {
        var _this = this;
        var returnPromise = new Promise(function (resolve, reject) {
            rp.get(_this.buildSearchUrl(option))
                .then(function (value) { return resolve(JSON.parse(value)); })
                .error(function (err) { return reject(err); });
        });
        return returnPromise;
    };
    PornHub.prototype.filterJSON = function (infos) {
        var returnObject = __assign({}, infos);
        var videos = returnObject['videos'];
        videos.forEach(function (video) {
            delete video['thumbs'];
            delete video['tags'];
            delete video['pornstars'];
            delete video['categories'];
        });
        return returnObject;
    };
    PornHub.prototype.hasFLV = function (videoID) {
        return __awaiter(this, void 0, void 0, function () {
            var videoSrc, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getVideoSource(videoID)];
                    case 1:
                        videoSrc = _a.sent();
                        if (typeof videoSrc !== 'undefined') {
                            this.cacheVideo.set(videoID, videoSrc);
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PornHub.prototype.getFLV = function (videoID) {
        return __awaiter(this, void 0, void 0, function () {
            var videoSrc, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (this.cacheVideo.has(videoID)) {
                            return [2 /*return*/, this.cacheVideo.get(videoID)];
                        }
                        return [4 /*yield*/, this.getVideoSource(videoID)];
                    case 1:
                        videoSrc = _a.sent();
                        this.cacheVideo.set(videoID, videoSrc);
                        return [2 /*return*/, String(videoSrc)];
                    case 2:
                        err_2 = _a.sent();
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PornHub.prototype.getVideoSource = function (videoID) {
        return __awaiter(this, void 0, void 0, function () {
            var driver, videoCSS, downloadURL, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, new selenium_webdriver_1.Builder().forBrowser("chrome")
                                .setChromeOptions(new chrome.Options().headless()
                                .addArguments("log-level=3")).build()];
                    case 1:
                        driver = _a.sent();
                        videoCSS = 'div > video > source';
                        return [4 /*yield*/, driver.get("" + this.videoURL + videoID)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css(videoCSS)), 10000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css(videoCSS)).getAttribute("src")];
                    case 4:
                        downloadURL = _a.sent();
                        driver.quit();
                        return [2 /*return*/, downloadURL];
                    case 5:
                        err_3 = _a.sent();
                        throw err_3;
                    case 6:
                        if (driver) {
                            driver.quit();
                        }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PornHub.prototype.buildSearchUrl = function (option) {
        var url = this.videoSearchBaseURL + "?";
        if (typeof option.category === 'string') {
            url += "&category=" + option.category;
        }
        if (typeof option.page === 'number') {
            if (option.page >= 0) {
                url += "&page=" + option.page;
            }
        }
        if (typeof option.search === 'string') {
            url += "&search=" + option.search;
        }
        if (typeof option.phrase === 'string') {
            url += "&phrase[]=" + option.phrase;
        }
        else if (option.phrase instanceof Array) {
            url += "&phrase[]=" + option.phrase.join(",");
        }
        if (typeof option.tags === 'string') {
            url += "&tags[]=" + option.tags;
        }
        else if (option.tags instanceof Array) {
            url += "&tags[]=" + option.tags.join(",");
        }
        if (option.ordering) {
            url += "&ordering=" + option.ordering;
        }
        if (option.period) {
            url += "&period=" + option.period;
        }
        if (option.thumbsize) {
            url += "&thumbsize=" + option.thumbsize;
        }
        else {
            url += "&thumbsize=small";
        }
        return url;
    };
    return PornHub;
}());
exports["default"] = PornHub;
module.exports = PornHub;
