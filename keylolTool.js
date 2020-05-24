// ==UserScript==
// @name         keylolTool
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  其乐社区工具箱
// @author       RaMui
// @match        *://keylol.com/*
// @grant        none
// ==/UserScript==

const main = () => {
    const url = ['https://keylol.com/home.php?mod=spacecp&ac=credit&op=exchange&handlekey=credit', 'https://keylol.com/home.php?mod=spacecp&ac=credit&op=exchange'];
    if (url.includes(window.location.href)) {
        create();
        const times = window.localStorage.getItem("multipleExchangeTimes");
        const loginPassword = window.localStorage.getItem("loginPassword");
        if (times !== null && loginPassword !== null) {
            if (Number(times) > 0) {
                const date = Math.floor(Math.random() * (8000 - 3000 + 1) + 3000);
                setTimeout(() => {
                    let oldTimes = Number(window.localStorage.getItem("multipleExchangeTimes"));
                    window.localStorage.setItem("multipleExchangeTimes", --oldTimes);
                    multipleExchangeFun();
                }, date);
            } else {
                alert('兑换操作已完成');
                clearLocalStorage();
                location.reload();
            }
        }
    } else {
        const li = document.createElement("li");
        li.innerHTML = '<a href="home.php?mod=spacecp&ac=credit&op=exchange">蒸汽兑换</a>';
        const dom = document.getElementsByClassName("dropdown-menu dropdown-menu-right")[0];
        dom.insertBefore(li, dom.getElementsByTagName("li")[1]);
    }
}

const saveHistory = () => {
    const div = document.getElementsByClassName('subforum_left_title_left_up');
    if (div.length > 0) {
        const website = window.location.href;
        const forum = div[0].children[0].getElementsByTagName('a')[3].innerText;
        const url = div[0].children[0].getElementsByTagName('a')[3].href;
        let time = document.getElementsByClassName('authicn vm')[0].nextSibling.nextSibling.innerText.replace('发表于 ', '');
        if (isNaN(time) && isNaN(Date.parse(time))) {
            time = document.getElementsByClassName('authicn vm')[0].nextSibling.nextSibling.children[0].title;
        }
        const reply = document.getElementsByClassName('subforum_right_title_left_down')[0].textContent;
        const view = document.getElementsByClassName('subforum_right_title_mid_down')[0].textContent;
        const collect = document.getElementsByClassName('subforum_right_title_right_down')[0].textContent;
        const auth = document.getElementsByClassName('authi')[0].innerText.trim();
        const authId = document.getElementsByClassName('authi')[0].children[0].href;
        const title = document.getElementById('thread_subject').title;
        const data = { timestamp: new Date().getTime(), title: title, website: website, forum: forum, url: url, time: time, auth: auth, authId: authId, reply: reply, view: view, collect: collect };
        saveData(data);
    }
}

const getHistory = () => {
    if (window.location.href.includes('https://keylol.com/forum.php?mod=guide')) {
        const li = document.createElement('li');
        li.innerHTML = '<a href="javascript:void(0);">浏览历史</a>';
        document.getElementById('thread_types').appendChild(li);
        li.onclick = () => {
            document.getElementsByTagName('h1')[0].innerText = '浏览历史';
            li.parentNode.childNodes.forEach(value => {
                value.className = '';
            })
            li.className = 'xw1 a';
            document.getElementById('threadlist').children[0].innerHTML = '<table cellspacing="0" cellpadding="0"><tbody><tr><th colspan="2">帖子标题</th><td class="by">帖子作者</td><td class="num">回复 / 查看 / 收藏</td><td class="by">查看时间</td><td class="by">操作</td></tr></tbody></table>';
            document.getElementById('threadlist').children[1].innerHTML = '<table cellspacing="0" cellpadding="0"><tbody></tbody></table>';
            if (document.getElementById('threadlist').children.length < 3) {
                document.getElementById('threadlist').appendChild(elementCreate('p', { 'class': 'mtm pns' }));
            }
            getData();
        }
    }
}

const saveData = (data) => {
    const request = window.indexedDB.open("history");
    request.onupgradeneeded = (e) => {
        if (!e.target.result.objectStoreNames.contains('pages')) {
            const objectStore = db.createObjectStore('pages', { keyPath: "title" });
            objectStore.createIndex("timestamp", "timestamp", { unique: false });
        }
    }

    request.onsuccess = (e) => {
        const objectStore = e.target.result.transaction(['pages'], 'readwrite').objectStore('pages');
        const result = objectStore.get(data.title);
        result.onsuccess = () => {
            if (result.result) {
                data.auth = result.result.auth;
                data.authId = result.result.authId;
                data.time = result.result.time;
                objectStore.put(data);
            } else {
                objectStore.add(data);
            }
        }
    }
}

const getData = () => {
    const request = window.indexedDB.open("history");
    request.onupgradeneeded = (e) => {
        if (!e.target.result.objectStoreNames.contains('pages')) {
            const objectStore = db.createObjectStore('pages', { keyPath: "title" });
            objectStore.createIndex("timestamp", "timestamp", { unique: false });
        }
    }

    request.onsuccess = (e) => {
        let html = '';
        const getRequest = e.target.result.transaction('pages').objectStore('pages').index("timestamp").openCursor();
        getRequest.onsuccess = (ev) => {
            const cursor = ev.target.result;
            if (cursor) {
                const time = dateFormat(cursor.value.timestamp);
                html += `<tr><td class="icn"><input type="checkbox" name="favorite[]" class="pc"></td>
                <th class="common"><div><a href="${cursor.value.url}" target="_blank">【${cursor.value.forum}】</a><a href="${cursor.value.website}" target="_blank" class="xst">${cursor.value.title}</a></div></th>
                <td class="by"><cite><a href="${cursor.value.authId}">${cursor.value.auth}</a></cite><em>${cursor.value.time}</em></td>
                <td class="num"><em>${cursor.value.reply} / ${cursor.value.view} / ${cursor.value.collect}</em></td>
                <td class="by"><span>${time}</span></td>
                <td class="by"><a href="javascript:void(0);">删除</a></td>
                </tr>`;
                cursor.continue();
            } else {
                if (html === '') {
                    html = '<tr><th colspan="5"><p class="emp">暂时还没有帖子</p></th></tr>';
                    document.getElementById('threadlist').children[2].innerHTML = '';
                } else {
                    document.getElementById('threadlist').children[2].innerHTML = '<label for="chkall"><input type="checkbox" name="chkall" id="chkall" class="pc vm">全选</label><button type="submit" name="delsubmit" value="true" class="pn pnc" id="deleteHistoryId"><em>删除选中历史</em></button>';
                    document.getElementById('chkall').onclick = (e) => checkAll(e);
                    document.getElementById('deleteHistoryId').onclick = () => deleteHistoryList();
                }
                document.getElementById('threadlist').children[1].children[0].innerHTML = html;
                const tr = document.querySelector('.bm_c').children[0].children[0].children;
                for (let i = 0; i < tr.length; i++) {
                    tr[i].children[5].children[0].onclick = (e) => deleteHistory(e);
                }
            }

        }
    }
}

const emptyHistory = () => {
    document.getElementsByClassName('mtm pns')[0].innerHTML = '';
    document.getElementById('threadlist').children[1].children[0].innerHTML = '<tr><th colspan="5"><p class="emp">暂时还没有帖子</p></th></tr>';
}

const deleteHistory = (obj) => {
    const check = confirm("是否删除该记录?");
    if (check) {
        const title = obj.path[2].children[1].getElementsByClassName('xst')[0].innerText;
        const request = window.indexedDB.open("history");
        request.onsuccess = (ev) => {
            ev.target.result.transaction(['pages'], 'readwrite').objectStore('pages').delete(title);
        }
        obj.path[2].remove();
        if (obj.path[3].children.length === 0) {
            emptyHistory();
        }
    }
}

const checkAll = (e) => {
    const input = document.getElementsByClassName('bm_c')[0].getElementsByTagName('input');
    for (let i = 0; i < input.length; i++) {
        input[i].checked = e.path[0].checked;
    }
}

const deleteHistoryList = () => {
    const check = confirm("是否删除选中记录?");
    if (check) {
        const request = window.indexedDB.open("history");
        const input = document.getElementsByClassName('bm_c')[0].getElementsByTagName('input');
        let isEmpty = true;
        request.onsuccess = (ev) => {
            const transactionRequest = ev.target.result.transaction(['pages'], 'readwrite').objectStore('pages');
            for (let i = 0; i < input.length; i++) {
                if (input[i].checked) {
                    const title = input[i].parentNode.nextSibling.nextSibling.getElementsByTagName('a')[1].innerText;
                    transactionRequest.delete(title);
                    // 此处使用remove()会改变input的值导致后续的循环出问题
                    input[i].parentNode.parentNode.style.display = 'none';
                } else {
                    isEmpty = false;
                }
            }
            if (isEmpty) {
                emptyHistory();
            }
        }
    }
}


const dateFormat = (time) => {
    time = new Date(time);
    return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}`;
}

const create = () => {
    const target = document.getElementsByClassName("creditl mtm bbda cl")[0];
    const allPoint = target.getElementsByTagName("li")[1].innerText.split(": ")[1].substring(0, 3);
    const maxTimes = Math.ceil((allPoint - 50) / 3);
    // 切换原版/增强兑换
    const selectModel = elementCreate('select', { 'class': 'ps' });
    selectModel.innerHTML = '<option value="0">原版兑换</option><option value="1">增强兑换</option>';
    target.parentNode.insertBefore(selectModel, target.nextSibling);
    // 切换兑换模式
    const labelStr = ["兑换次数", "蒸汽用量"];
    const select = elementCreate('select', { 'class': 'ps' });
    select.innerHTML = '<option value="0">指定兑换次数</option><option value="1">指定蒸汽用量</option>';
    const tdModelEmpty = elementCreate("td", { "class": "pns", "colspan": "2" });
    tdModelEmpty.appendChild(select);
    const tr1 = document.createElement("tr");
    tr1.innerHTML = '<th>兑换模式</th>';
    tr1.appendChild(tdModelEmpty);
    // 兑换次数/蒸汽用量输入
    const thMsgLable = document.createElement("th");
    thMsgLable.innerText = labelStr[0];
    const input = elementCreate("input", { "type": "text", "class": "px", "size": "5", "value": "0" });
    const tdInput = elementCreate("td", { "class": "pns" });
    tdInput.appendChild(input);
    const tdMsg = elementCreate("td", { "width": "300", "class": "d" });
    tdMsg.append(`最大可兑换次数为${maxTimes}次`);
    const tr2 = document.createElement("tr");
    tr2.appendChild(thMsgLable);
    tr2.appendChild(tdInput);
    tr2.appendChild(tdMsg);
    // 兑换按钮
    const button = elementCreate("button", { "class": "pn" });
    button.innerHTML = '<em>兑换</em>';
    const td3 = elementCreate("td", { "colspan": "2" });
    td3.appendChild(button);
    const tr3 = document.createElement("tr");
    tr3.innerHTML = '<th></th>';
    tr3.appendChild(td3);
    // 最外层的table
    const tbody = document.createElement("tbody");
    tbody.appendChild(tr1);
    tbody.appendChild(tr2);
    tbody.appendChild(tr3);
    const table = elementCreate("table", { "cellspacing": "0", "cellpadding": "0", "class": "tfm mtn", "id": "multiExchangeTableId", "style": "display:none" })
    table.appendChild(tbody);
    document.getElementById("exchangeform").parentNode.appendChild(table);

    input.onkeyup = () => {
        input.value = Number(input.value.replace(/[^0-9]+/g, ''));
        if (select.value === '0' && input.value > maxTimes) {
            input.value = maxTimes;
        } else if (select.value === '1' && input.value > allPoint - 50) {
            input.value = allPoint - 50;
        }
    }
    button.onclick = () => {
        let times;
        if (select.value === "0") {
            times = input.value;
            if (times === maxTimes && (allPoint - 50) % 3 !== 0) {
                window.localStorage.setItem("lastExchangePoint", (allPoint - 50) % 3);
            }
        } else {
            const num = Number(input.value);
            times = Math.ceil(num / 3);
            if (num % 3 !== 0) {
                window.localStorage.setItem("lastExchangePoint", num % 3);
            }
        }
        window.localStorage.setItem("multipleExchangeTimes", --times);
        multipleExchangeFun();

    }
    select.onchange = () => {
        input.value = 0;
        thMsgLable.innerText = labelStr[select.value];
        tdMsg.innerText = [`最大可兑换次数为${maxTimes}次`, `最大可兑换蒸汽为${allPoint - 50}点`][select.value];
    }
    selectModel.onchange = () => {
        const display = ['none', ''][selectModel.value];
        const visible = ['', 'none'][selectModel.value];
        document.getElementById("multiExchangeTableId").style.display = display;
        document.getElementById("exchangeform").childNodes[9].childNodes[1].childNodes[0].style.display = visible;
        document.getElementById("exchangeform").childNodes[9].childNodes[1].childNodes[4].style.display = visible;
    }
}

const multipleExchangeFun = () => {
    let exchangePoint = 3;
    let loginPassword = window.localStorage.getItem("loginPassword");
    if (loginPassword === null || document.getElementsByTagName("input").password.value !== '') {
        loginPassword = document.getElementsByTagName("input").password.value;
        window.localStorage.setItem("loginPassword", loginPassword);
    }
    if (Number(window.localStorage.getItem("multipleExchangeTimes")) === 0 && Number(window.localStorage.getItem("lastExchangePoint")) !== 0) {
        exchangePoint = Number(window.localStorage.getItem("lastExchangePoint"));
    }
    document.getElementById("exchangeamount").value = exchangePoint;
    document.getElementsByTagName("input").password.value = loginPassword;
    document.getElementById("exchangesubmit_btn").click();
}

const elementCreate = (elementName, map) => {
    const element = document.createElement(elementName);
    for (let key in map) {
        element.setAttribute(key, map[key]);
    }
    return element;
}
const clearLocalStorage = () => {
    window.localStorage.removeItem('multipleExchangeTimes');
    window.localStorage.removeItem('loginPassword');
    window.localStorage.removeItem('lastExchangePoint');
}

(() => {
    'use strict';
    saveHistory();
    main();
    getHistory();
})();

document.onkeydown = (event) => {
    if (window.localStorage.getItem("multipleExchangeTimes") != null && (event.ctrlKey && event.keyCode === 90)) {
        clearLocalStorage();
        alert('兑换操作已停止');
        location.reload();
    }
}