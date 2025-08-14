// ==UserScript==
// @name         iKuuu机场签到
// @namespace    https://github.com/biMid
// @version      25.08.14
// @description  每天 iKuuu 自动签到领流量
// @author       Vikrant、biMid
// @match        https://docs.scriptcat.org/dev/background.html#promise
// @crontab      * * once * *
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_notification
// @license      GNU GPLv3
// ==/UserScript==

return new Promise((resolve, reject) => {

    const BASE_URL = "https://ikuuu.ch"; // 统一域名修改点
    const URLS = {
        user: `${BASE_URL}/user`,
        login: `${BASE_URL}/auth/login`,
        checkin: `${BASE_URL}/user/checkin`
    };

    const MAX_RETRY = 7;         // 签到失败重试次数
    const MAX_RUN_TIME = 1000 * 100; // 最大运行时间（毫秒）
    let retryCount = 0;
    let finished = false;

    // 总超时控制
    const timeoutId = setTimeout(() => {
        if (!finished) {
            finished = true;
            reject("脚本运行超时");
        }
    }, MAX_RUN_TIME);

    // 统一弹通知
    function notify(title, text, onclick) {
        GM_notification({
            title,
            text,
            timeout: 10000,
            onclick: (id) => {
                if (onclick) onclick();
                GM_closeNotification(id);
            }
        });
    }

    // 统一的请求方法（带重试）
    function retryRequest(options, stage) {
        GM_xmlhttpRequest({
            ...options,
            onload: (xhr) => {
                if (xhr.status === 200) {
                    options.onsuccess && options.onsuccess(xhr);
                } else {
                    handleRetry(stage);
                }
            },
            ontimeout: () => handleRetry(stage, "请求超时"),
            onabort: () => handleRetry(stage, "请求被终止"),
            onerror: () => handleRetry(stage, "请求出错")
        });
    }

    function handleRetry(stage, reason = "请求失败") {
        retryCount++;
        GM_log(`[${stage}] ${reason}，第 ${retryCount} 次重试`, "info");
        if (retryCount > MAX_RETRY) {
            if (!finished) {
                finished = true;
                notify("签到失败", "出错超过七次，已退出脚本。");
                reject("出错超过七次");
            }
        } else {
            setTimeout(() => {
                if (stage === "checkin") doCheckin();
                else if (stage === "loginCheck") checkLogin();
            }, 1000 + Math.random() * 3000);
        }
    }

    // 检测是否已登录
    function checkLogin() {
        retryRequest({
            method: "GET",
            url: URLS.user,
            onsuccess: (xhr) => {
                if (xhr.finalUrl.includes(URLS.login)) {
                    if (!finished) {
                        finished = true;
                        notify("iKuuu 未登录", "请登录后重新运行脚本", () => {
                            GM_openInTab(URLS.login);
                        });
                        reject("未登录");
                    }
                } else if (xhr.finalUrl.includes(URLS.user)) {
                    GM_log("检测到已登录，开始签到", "info");
                    doCheckin();
                } else {
                    if (!finished) {
                        finished = true;
                        reject(`未知跳转地址: ${xhr.finalUrl}`);
                    }
                }
            }
        }, "loginCheck");
    }

    // 执行签到
    function doCheckin() {
        retryRequest({
            method: "POST",
            url: URLS.checkin,
            responseType: "json",
            timeout: 5000,
            onsuccess: (xhr) => {
                if (!finished) {
                    finished = true;
                    clearTimeout(timeoutId);
                    resolve(xhr.response?.msg || "签到成功（无返回消息）");
                }
            }
        }, "checkin");
    }

    // 启动
    checkLogin();
});
