// ==UserScript==
// @name         iKuuu机场签到
// @namespace    https://github.com/biMid
// @version      25.08.14
// @description  每天iKuuu机场自动签到领流量，必须使用脚本猫，请勿使用油猴
// @author       Vikrant、biMid
// @match        https://docs.scriptcat.org/dev/background.html#promise
// @crontab      * * once * *
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_notification
// @license      GNU GPLv3
// ==/UserScript==

return new Promise((resolve, reject) => {
	let i = 0;
	let j = 0;
	GM_xmlhttpRequest({
		method: "GET",
		url: "https://ikuuu.ch/user",
		onload: (xhr) => {
			if (xhr.finalUrl == "https://ikuuu.ch/auth/login") {
				GM_notification({
					title: "iKuuu未登录！",
					text: "请点击登陆后重新运行脚本",
					onclick: (id) => {
						GM_openInTab("https://ikuuu.ch/auth/login");
						GM_closeNotification(id);
					},
					timeout: 10000,
				});
				clearInterval(scan);
				reject("未登录");
			} else if (xhr.finalUrl == "https://ikuuu.ch/user") {
				//
			} else {
				clearInterval(scan);
				reject("网页跳转向了一个未知的网址");
			}
		},
	});
	function main() {
		setTimeout(() => {
			GM_xmlhttpRequest({
				method: "POST",
				url: "https://ikuuu.ch/user/checkin",
				responseType: "json",
				timeout: 5000,
				onload: (xhr) => {
					let msg = xhr.response.msg;
					if (xhr.status == 200) {
						clearInterval(scan);
						resolve(msg);
					} else {
						GM_log("请求失败，再试一次。", "info");
						++i;
						main();
					}
				},
				ontimeout: () => {
					GM_log("请求超时，再试一次。", "info");
					++i;
					main();
				},
				onabort: () => {
					GM_log("请求终止，再试一次。", "info");
					++i;
					main();
				},
				onerror: () => {
					GM_log("请求错误，再试一次。", "info");
					++i;
					main();
				},
			});
		}, 1000 + Math.random() * 4000);
	}
	let scan = setInterval(() => {
		++j;
		if (i >= 7) {
			GM_notification({
				title: "出错超过七次，已退出脚本。",
				text: "请检查问题并重新运行脚本。",
			});
			clearInterval(scan);
			reject("出错超过七次，已退出脚本。");
		} else if (j >= 32) {
			reject("脚本运行超时");
		}
	}, 3000);
	main();
});
