// ==UserScript==
// @name         哔哩哔哩自动打开字幕
// @namespace    https://github.com/biMid
// @version      25.08.14
// @description  哔哩哔哩播放视频时自动打开网站字幕
// @author       biMid
// @match        https://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let queryValue = '';
    // 定时检测URL是否发生变化
    let timer = setInterval(function() {
        // 获取URL中的查询字符串部分
        const queryString = window.location.search;
        // 解析查询字符串，将参数以对象的形式存储
        const params = new URLSearchParams(queryString);
        // 获取特定参数的值
        const value = params.get('p');
        if (queryValue !== value) {
            openSubtitle();
            queryValue = value;
        }
    }, 2000);

    window.addEventListener('unload', function(_event) {
        clearInterval(timer)
    });

    function openSubtitle(){
        setTimeout(() => { document.querySelector('.bpx-player-ctrl-btn[aria-label="字幕"] .bpx-common-svg-icon').click(); }, 1000)
    }
})();
