initMenuList();

//IE10和IE9使用原生的alert
if(IEVersion() > 10){
    window.alert = function (str, code) {
        var codeContent = "";
        if (code === 0) {
            codeContent = "success";
        } else {
            codeContent = "Error";
        }

        var shieldDom = document.getElementById("shield");
        if (shieldDom) {
            shieldDom.parentNode.removeChild(shieldDom);
        }

        var alertFramDom = document.getElementById("alertFram");
        if (alertFramDom) {
            alertFramDom.parentNode.removeChild(alertFramDom);
        }

        var shield = document.createElement("DIV");
        shield.id = "shield";
        shield.style.position = "fixed";
        shield.style.left = "0";
        shield.style.top = "0";
        shield.style.right = "0";
        shield.style.bottom = "0";
        //弹出对话框时的背景颜色
        shield.style.background = "#fff";
        shield.style.opacity = "0.5";
        shield.style.textAlign = "center";
        shield.style.zIndex = "25";
        //背景透明 IE有效
        //shield.style.filter = "alpha(opacity=0)";
        var alertFram = document.createElement("DIV");
        alertFram.id = "alertFram";
        alertFram.style.position = "fixed";
        alertFram.style.left = "50%";
        alertFram.style.top = "10%";
        alertFram.style.marginLeft = "-155px";
        alertFram.style.width = "520px";
        alertFram.style.height = "150px";
        alertFram.style.textAlign = "center";
        alertFram.style.lineHeight = "150px";
        alertFram.style.zIndex = "300";
        strHtml = "<ul style=\"list-style:none;margin:0;padding:0;width:60%\">\n";
        strHtml += " " +
            "<li style=\"background:#42403c;text-align:left;padding-left:20px;font-size:16px;font-weight:bold;height:35px;" +
            "line-height:30px;border:6px solid #42403c; color: lavender;border-top-left-radius: 5px;border-top-right-radius:5px;\">" +
            "Information:\n" + (codeContent) + "\n[" + code + "]" +
            "</li>\n";
        strHtml += " " +
            "<li style=\"background:#fff;text-align:center;font-size:15px;height:120px;line-height:50px;border-left:6px solid #42403c;" +
            "border-right:6px solid #42403c; max-width: 300px\">" + str + "" +
            "</li>\n";
        strHtml += " " +
            "<li style=\"background:#FDEEF4;text-align:center;font-weight:bold;height:30px;line-height:30px; border-left: 6px solid #42403c;" +
            "border-right: 6px solid #42403c;border-bottom: 6px solid #42403c; border-top: 3px solid #42403c;" +
            "border-bottom-left-radius: 5px;border-bottom-right-radius:5px;\">" +
            "<input type=\"button\" value=\"Sure\" onclick=\"doOk()\" " +
            "style=\"background-color:rgb(94, 94, 94);border-radius: 0.25rem;color: rgb(255, 255, 255); width: 60px; " +
            "height: 25px; margin-right: -200px;\"/>" +
            "</li>\n";
        strHtml += "</ul>\n";
        alertFram.innerHTML = strHtml;
        document.body.appendChild(alertFram);
        document.body.appendChild(shield);
        this.doOk = function () {
            alertFram.style.display = "none";
            shield.style.display = "none";
        };
        alertFram.focus();
        document.body.onselectstart = function () {
            return false;
        };
    };
}

//ip合法性判断
String.prototype.isIP = function () {
    var reSpaceCheck = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var match = this.match(reSpaceCheck);
    if (match) {
        return match[1] <= 255 && match[1] >= 0
            && match[2] <= 255 && match[2] >= 0
            && match[3] <= 255 && match[3] >= 0
            && match[4] <= 255 && match[4] >= 0;
    } else {
        return false;
    }
};

// 英文字母和数字随机组合的字符串(八位)
function getUUID() {
    var UUID = '';
    for (var i = 0; i < 8; i++) {
        var random = Math.floor(Math.random() * 36);
        UUID += random < 10 ? random : String.fromCharCode(65 + random - 10);
    }
    return UUID;
}

function ajax(option) {
    var ajaxData = {
        type: option.type || "GET",
        url: option.url || "",
        async: typeof option.async === "undefined" ? true : option.async,
        data: option.data || {},
        dataType: option.dataType || "",
        isUploadFile: option.isUploadFile || false,
        timeout: option.timeout || 120000,
        contentType: option.contentType || "application/json",
        beforeSend: option.beforeSend || function () {
        },
        success: option.success || function () {
        },
        error: option.error || function () {
        }
    };

    var timer = null;

    ajaxData.beforeSend();

    var xhr = createxmlHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            try {
                if (xhr.status === 200) {
                    var obj = JSON.parse(xhr.responseText);
                    doError(obj);
                    ajaxData.success(xhr.responseText);   // 不兼容response
                } else {
                    alert("Failed");
                }
            } catch (e) {
                console.log(e);
            }
            clearTimeout(timer);
            if (!option.noLoading) {
                g_hideLoading();
            }
        }
    };

    timer = setTimeout(function () {
        xhr.abort();
        if (!option.noLoading) {
            g_hideLoading();
        }
        alert('Request Timeout!');
    }, ajaxData.timeout);

    if (!option.noLoading) {
        g_showLoading();
    }

    xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
    if (!option.isUploadFile) {
        xhr.setRequestHeader("Content-Type", ajaxData.contentType);
    }

    if (option.isUploadFile) {
        xhr.setRequestHeader("isIELowIE10", "1");
        xhr.send(ajaxData.data);
    } else {
        if (ajaxData.type === "GET") {
            xhr.send(null);
        } else {
            xhr.send(JSON.stringify(ajaxData.data));
        }
    }


}
/*
 * 错误码定义:
 * -1: 其他错误
 * 0: 请求成功
 * 1: 操作失败
 * 2: 用户名错误
 * 3: 密码错误
 * 4: 用户名或密码错误
 * 5: 重启失败
 * 6: 恢复出厂设置失败
 * 7: 当前密码错误
 * 8: 浏览器版本太低
 * 9: 参数校验错误
 *
 * */
function doError(obj) {
    switch (parseInt(obj['code'])) {
        case -1:
        case 1:
            alert("Failed", obj['code']);
            xhr.abort();
            break;
        case 2:
            alert("UserName Error", obj['code']);
            xhr.abort();
            break;
        case 3:
            alert("Password Error", obj['code']);
            xhr.abort();
            break;
        case 4:
            alert("UserName or Password Error", obj['code']);
            xhr.abort();
            break;
        case 5:
            alert("Reboot Failed!", obj['code']);
            xhr.abort();
            break;
        case 6:
            alert("Factory Settings Failed!", obj['code']);
            xhr.abort();
            break;
        case 7:
            alert("Current Password Error", obj['code']);
            xhr.abort();
            break;
    }
}
function createxmlHttpRequest() {
    if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
}

function getIPFromApiValue(value) {
    var str = [];
    str[0] = String((value >>> 24) >>> 0) + '.';
    str[1] = String(((value << 8) >>> 24) >>> 0) + '.';
    str[2] = String((value << 16) >>> 24) + '.';
    str[3] = String((value << 24) >>> 24);
    return str[0] + str[1] + str[2] + str[3];
}

function getApiValueFromIP(IP) {
    var value = [];
    IP = IP.split('.');
    value[0] = Number(IP[0]) * 256 * 256 * 256;
    value[1] = Number(IP[1]) * 256 * 256;
    value[2] = Number(IP[2]) * 256;
    value[3] = Number(IP[3]);
    return value[0] + value[1] + value[2] + value[3];
}

function g_showLoading() {
    if (document.getElementsByClassName("loading").length === 0) {
        var div = document.createElement("div");
        var attr = document.createAttribute("class");
        attr.value = "loading";
        div.setAttributeNode(attr);
        var img = document.createElement("img");
        attr = document.createAttribute("class");
        attr.value = "loadingImg";
        img.setAttributeNode(attr);
        attr = document.createAttribute("src");
        attr.value = "img/loading.gif";
        img.setAttributeNode(attr);
        div.appendChild(img);
        document.getElementsByTagName("body").item(0).appendChild(div);
    }
    document.getElementsByClassName("loading")[0].style.display = "block";
}

function g_hideLoading() {
    if (document.getElementsByClassName("loading").length !== 0) {
        document.getElementsByClassName("loading")[0].style.display = "none";
    }
}

function toggleMenuShow(Menu) {
    if (!Menu.className.match(/(\s+|^)hide(\s+|$)/)) {
        Menu.className += " hide";
    } else {
        Menu.className = Menu.className.replace("hide", "");
    }
}

function initMenuList() {
    var h3List = document.querySelectorAll(".menuDiv>h3");
    for (var i = 0; i < h3List.length; i++) {
        if (window.addEventListener) {
            h3List[i].addEventListener("click", function () {
                toggleMenuShow(this.parentNode);
            }, false);
        } else {
            h3List[i].onclick = function () {
                toggleMenuShow(this);
            }
        }
    }
}

function $(str) {
    if (/^\s*\./.test(str)) {
        return document.getElementsByClassName(str.substr(str.indexOf(".") + 1))[0];
    } else if (/^\s*#/.test(str)) {
        return document.getElementById(str.substr(str.indexOf("#") + 1));
    }
}

function initSelect(dom, options, value) {
    dom.options.length = 0;
    for (var i = 0; i < options.length; i++) {
        dom.options.add(new Option(options[i].txt, options[i].val));
    }
    var flag = false;
    for (var j = 0; j < options.length; j++) {
        if (options[j].val == value) {
            flag = true;
            break;
        }
    }

    if (flag) {
        dom.value = value;
    } else {
        if (options.length > 0) {
            dom.value = options[0].val;
        }
    }
}


//判断浏览器
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
            return 7;
        } else if(fIEVersion == 8) {
            return 8;
        } else if(fIEVersion == 9) {
            return 9;
        } else if(fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if(isIE) {
        return 11;//edge
    } else if(isEdge) {
        return 12; //IE11
    }else{
        return 13;//不是ie浏览器
    }
}

function colseTimeout(timer) {
    clearTimeout(timer);
}