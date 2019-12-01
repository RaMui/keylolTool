// ==UserScript==
// @name         keylol蒸汽兑换增强脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  其乐社区高收益蒸汽兑换脚本
// @author       RaMui
// @match        *://keylol.com/*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
    if (window.location.href === 'https://keylol.com/home.php?mod=spacecp&ac=credit&op=exchange') {
        create();
        if (window.localStorage.getItem("multipleExchangeTimes") != null) {
            if (Number(window.localStorage.getItem("multipleExchangeTimes")) > 0) {
                var date = Math.floor(Math.random() * (8000 - 3000 + 1) + 3000);
                let allPoint = document.getElementsByClassName("creditl mtm bbda cl")[0].getElementsByTagName("li")[1].innerText.split(": ")[1].substring(0, 3);
                setTimeout(function () {
                    var oldTimes = Number(window.localStorage.getItem("multipleExchangeTimes"));
                    window.localStorage.setItem("multipleExchangeTimes", --oldTimes);
                    if (window.localStorage.getItem("allPoint") !== allPoint) {
                        multipleExchangeFun();
                    } else {
                        window.localStorage.clear();
                    }
                }, date);
            } else {
                showDialog('兑换操作已完成', 'alert', null, null, 0, null, null, null, null, 1, null);
                window.localStorage.clear();
            }
        }
    } else {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute('href', 'home.php?mod=spacecp&ac=credit&op=exchange');
        var text = document.createTextNode("蒸汽兑换");
        a.appendChild(text);
        li.appendChild(a);
        document.getElementsByClassName("dropdown-menu dropdown-menu-right")[0].insertBefore(li, document.getElementsByClassName("dropdown-menu dropdown-menu-right")[0].getElementsByTagName("li")[1]);
    }
})();

document.onkeydown = function (e) {
    var keyCode = e.keyCode || e.which || e.charCode;
    var ctrlKey = e.ctrlKey || e.metaKey;
    if (window.localStorage.getItem("loginPassword") != null && window.localStorage.getItem("loginPassword") != null) {
        if (ctrlKey && keyCode === 90) {
            showDialog('兑换操作已停止', 'alert', null, null, 0, null, null, null, null, 1, null);
            window.localStorage.clear();
            location.reload();
        }
    }
}

function create() {
    let allPoint = document.getElementsByClassName("creditl mtm bbda cl")[0].getElementsByTagName("li")[1].innerText.split(": ")[1].substring(0, 3);
    let maxTimes = Math.ceil((allPoint - 50) / 3);
    var selectModel = elementCreate("select", { "name": "selectModel", "id": "selectModelId", "class": "ps" });
    var thModelLable = document.createElement("th");
    thModelLable.append("兑换模式");
    var modelStr = ["指定兑换次数", "指定蒸汽用量"];
    var labelStr = ["兑换次数", "蒸汽用量"];
    var selectStr = ["原版兑换", "增强兑换"]
    var select = elementCreate("select", { "name": "exchangeModel", "id": "exchangeModel", "class": "ps" });
    for (let i = 0; i < 2; i++) {
        var option = elementCreate("option", { "value": i });
        option.append(modelStr[i]);
        select.appendChild(option);
        option = elementCreate("option", { "value": i });
        option.append(selectStr[i]);
        selectModel.appendChild(option);
    }
    var target = document.getElementsByClassName("creditl mtm bbda cl")[0];
    target.parentNode.insertBefore(selectModel, target.nextSibling);
    var tdModelEmpty = elementCreate("td", { "class": "pns", "colspan": "2" });
    tdModelEmpty.appendChild(select);
    var tr1 = document.createElement("tr");
    tr1.appendChild(thModelLable);
    tr1.appendChild(tdModelEmpty);
    var thMsgLable = document.createElement("th");
    thMsgLable.append("兑换次数");
    var input = elementCreate("input", { "id": "exchangeamountTimes", "type": "text", "name": "exchangeTimes", "class": "px", "size": "5", "value": "0" });
    var tdInput = elementCreate("td", { "class": "pns" });
    tdInput.appendChild(input);
    var tdMsg = elementCreate("td", { "width": "300", "class": "d" });
    tdMsg.append("最大可兑换次数为" + maxTimes + "次");
    var tr2 = document.createElement("tr");
    tr2.appendChild(thMsgLable);
    tr2.appendChild(tdInput);
    tr2.appendChild(tdMsg);
    var thEmpty = document.createElement("th");
    var button = elementCreate("button", { "id": "multipleExchangeSubmit", "class": "pn" });
    var em = elementCreate("em", { "style": "color:#fff" });
    em.append("兑换");
    button.appendChild(em);
    var td3 = elementCreate("td", { "colspan": "2" });
    td3.appendChild(button);
    var tr3 = document.createElement("tr");
    tr3.appendChild(thEmpty);
    tr3.appendChild(td3);
    var tbody = document.createElement("tbody");
    tbody.appendChild(tr1);
    tbody.appendChild(tr2);
    tbody.appendChild(tr3);
    var table = elementCreate("table", { "cellspacing": "0", "cellpadding": "0", "class": "tfm mtn", "id": "multiExchangeTableId", "style": "display:none" })
    table.appendChild(tbody);
    document.getElementById("exchangeform").parentNode.appendChild(table);
    input.onkeyup = function () {
        input.value = input.value.replace(/[^0-9]+/g, '');
        if (Number(input.value) > 1) {
            if (select.value === '0' && Number(input.value) > maxTimes) {
                input.value = maxTimes;
            } else if (select.value === '1' && Number(input.value) > allPoint - 50) {
                input.value = allPoint - 50;
            }
        } else if (Number(input.value) < 1) {
            input.value = 0;
        }
        input.value = parseInt(input.value);
    }
    button.onclick = function () {
        window.localStorage.setItem("allPoint", allPoint);
        if (Number(input.value) === 0) {
            showDialog('抱歉，请先输入数字!', 'alert', null, null, 0, null, null, null, null, 1, null);
        } else {
            let times = 0;
            if (select.value === "0") {
                times = input.value;
                if (times === maxTimes && (allPoint - 50) % 3 !== 0) {
                    window.localStorage.setItem("lastExchangePoint", (allPoint - 50) % 3);
                }
            } else {
                let num = Number(input.value);
                times = Math.ceil(num / 3);
                if (num % 3 !== 0) {
                    window.localStorage.setItem("lastExchangePoint", num % 3);
                }
            }
            window.localStorage.setItem("multipleExchangeTimes", times - 1);
            multipleExchangeFun();
        }

    }
    select.onchange = function () {
        thMsgLable.innerText = labelStr[select.value];
        input.value = 0;
        if (select.value === '0') {
            tdMsg.innerText = "最大可兑换次数为" + maxTimes + "次";
        } else {
            tdMsg.innerText = "最大可兑换蒸汽为" + (allPoint - 50) + "点";
        }
    }
    selectModel.onchange = function () {
        if (selectModel.value === '0') {
            document.getElementById("multiExchangeTableId").style.display = 'none';
            document.getElementById("exchangeform").childNodes[9].childNodes[1].childNodes[0].style.display = '';
            document.getElementById("exchangeform").childNodes[9].childNodes[1].childNodes[4].style.display = '';
        } else {
            document.getElementById("multiExchangeTableId").style.display = '';
            document.getElementById("exchangeform").childNodes[9].childNodes[1].childNodes[0].style.display = 'none';
            document.getElementById("exchangeform").childNodes[9].childNodes[1].childNodes[4].style.display = 'none';
        }
    }
}

function multipleExchangeFun() {
    let exchangePoint = 3;
    var loginPassword = "";
    if (window.localStorage.getItem("loginPassword") == null) {
        loginPassword = document.getElementsByTagName("input").password.value;
        window.localStorage.setItem("loginPassword", loginPassword);
    } else {
        loginPassword = window.localStorage.getItem("loginPassword");
    }
    if (Number(window.localStorage.getItem("multipleExchangeTimes")) === 0 && Number(window.localStorage.getItem("lastExchangePoint")) !== 0) {
        exchangePoint = Number(window.localStorage.getItem("lastExchangePoint"));
    }
    document.getElementById("exchangeamount").value = exchangePoint;
    document.getElementsByTagName("input").password.value = loginPassword;
    document.getElementById("exchangesubmit_btn").click();
}

function elementCreate(elementName, map) {
    var element = document.createElement(elementName);
    for (var key in map) {
        element.setAttribute(key, map[key]);
    }
    return element;
}