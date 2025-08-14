// ==UserScript==
// @name         京东自动评价
// @namespace    https://github.com/biMid
// @version      25.08.01
// @description  自动对5620进行评价
// @author       biMid
// @match        https://club.jd.com/myJdcomments/productPublish*
// @match        https://club.jd.com/afterComments/productPublish*
// @match        https://club.jd.com/myJdcomments/orderVoucher*
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // 填入文字评价
    var textareas = document.querySelectorAll('textarea');
    textareas.forEach(function (textarea) {
        textarea.value = "操作简单，家用必备，性价比高，强烈推荐给需要优质网络体验的朋友们！";
    });

    setTimeout(() => {
        // 评分按钮
        var fiveStarButtons1 = document.querySelectorAll('.star[data-id="A1"]');
        fiveStarButtons1.forEach(function (button) {
            button.click();
        });
        var fiveStarButtons2 = document.querySelectorAll('.star.star5');
        fiveStarButtons2.forEach(function (button) {
            button.click();
        });
    }, 300);

    setTimeout(() => {
        // 上传图片
        const elementByClass = document.querySelector(".btn-upload");
        if (elementByClass) {
            elementByClass.click();
        }
    }, 600);


})();
