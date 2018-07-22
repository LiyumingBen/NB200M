var ipAddress = document.getElementsByClassName("ipAddress")[0];
var netMask = document.getElementsByClassName("netMask")[0];
var gateway = document.getElementsByClassName("gateway")[0];
var mac = document.getElementsByClassName("mac")[0];
var softWare_Version = document.getElementsByClassName("SoftWare_Version")[0];
var hardWare_Version = document.getElementsByClassName("HardWare_Version")[0];
var firmWare_Version = document.getElementsByClassName("FirmWare_Version")[0];
var license  = document.getElementsByClassName("license")[0];
var oldPassword = document.getElementsByClassName("oldPassword")[0];
var newPassword = document.getElementsByClassName("newPassword")[0];
var confirmPassword = document.getElementsByClassName("confirmPassword")[0];

var o_ipAddress = "";
getNetwork();
getVersionInfo();

function getVersionInfo() {
    ajax({
        type: "GET",
        dataType: "json",
        url: "version.cgi",
        success: function (str) {
            var obj = JSON.parse(str);
            if (typeof obj !== "undefined" && typeof obj["code"] !== "undefined" && obj["code"] === 0) {
                softWare_Version.value = obj["software"];
                hardWare_Version.value = obj["hardware"];
                firmWare_Version.value = obj['firmware'];
                license.value = obj['license'];
            }
        }
    });
}

function getNetwork() {
    ajax({
        type: "GET",
        dataType: "json",
        url: "network.cgi",
        success: function (str) {
            var obj = JSON.parse(str);
            if (typeof obj !== "undefined" && typeof obj["code"] !== "undefined" && obj["code"] === 0) {
                o_ipAddress = ipAddress.value = obj["network"].ip;
                netMask.value = obj["network"].netmask;
                gateway.value = obj["network"].gateway;
                mac.value = obj['network'].mac.toUpperCase();
            }
        }
    });
}

function setNetwork() {
    var ipAddress_val = ipAddress.value;
    var netMask_val = netMask.value;
    var gateway_val = gateway.value;

    if (ipAddress_val === "" || netMask_val === "" || gateway_val === "") {
        return;
    }

    if (ipAddress_val.isIP() && netMask_val.isIP() && gateway_val.isIP()) {

        var netObj = {
            "ip": ipAddress_val,
            "netmask": netMask_val,
            "gateway": gateway_val
        };
        var o = {
            "network": netObj
        };
        ajax({
            type: "POST",
            dataType: "json",
            url: "network.cgi",
            data: o,
            success: function () {
                if (ipAddress_val !== o_ipAddress) {
                    var tips = confirm("Setting parameters success, take effect after reboot, reboot now?");
                    if (tips) {
                        setTimeout(function () {
                            g_showLoading();
                        }, 100);
                        systemReboot();
                        setTimeout(function () {
                            g_hideLoading();
                            localStorage.removeItem("name");
                            top.location.href = "http://" + ipAddress_val + '/Login.html?s=' + getUUID();
                        }, 30000);
                    }

                } else {
                    alert("Setting Success!", 0);
                    getNetwork();
                }
            }
        });
    } else {
        alert("Please input correct IP address!", 9);
    }
}

function systemReboot() {
    ajax({
        type: "POST",
        dataType: "json",
        url: "reboot.cgi",
        success: function () {
            alert("Reboot Success!", 0);
        }
    });
}

function systemDefault() {
    ajax({
        type: "POST",
        dataType: "json",
        url: "factory.cgi",
        success: function () {
            var tips = confirm("Factory Settings Success!, take effect after reboot, reboot now?");
            if (tips) {
                setTimeout(function () {
                    g_showLoading();
                }, 100);
                systemReboot();
                setTimeout(function () {
                    g_hideLoading();
                }, 30000);
            }
        }
    });
}

function changePassword() {
    var o = {
        "old_pwd": oldPassword.value,
        "new_pwd": newPassword.value
    };

    //密码校验
    if (oldPassword.value.length > 30 || oldPassword.value.length <= 0) {
        alert("Current password input error,password length range:[1,30]", 9);
        return false;
    }

    if (newPassword.value.length > 30 || newPassword.value.length <= 0) {
        alert("New password input error,password length range:[1,30]", 9);
        return false;
    }

    if (confirmPassword.value.length > 30 || confirmPassword.value.length <= 0) {
        alert("Confirm password input error,password length range:[1,30]", 9);
        return false;
    }

    if (oldPassword.value === newPassword.value) {
        alert("Current and new password must be different!", 9);
        return false;
    }

    if (newPassword.value !== confirmPassword.value) {
        alert("New and Confirmation password are not the same!", 9);
        return false;
    }

    ajax({
        type: "POST",
        dataType: "json",
        url: "modify_pwd.cgi",
        data: o,
        success: function () {
            alert("Password changed successfully, please login again!", 0);
        }
    });
}

//配置和授权导出
function exportFile(url, name) {
    // 去掉因为重复创建iframe而id同名的iframe
    var iframe_id = document.getElementById(name);
    if (iframe_id !== null) {
        iframe_id.parentNode.removeChild(iframe_id);
    }
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.setAttribute("id", name);
    iframe.style.display = "none";
    iframe.onload = function () {
        var win = document.getElementById(name).contentWindow;
        var str = win.document.body.innerText;
        if (str) {
            var json = JSON.parse(str + "");
            if (typeof json.code !== "undefined" && json.code !== 0) {
                alert("Failed", -1);
            }
        }
    };
    document.body.appendChild(iframe);
}

//配置导入
$('.import').innerHTML = '';
var str = [];
if (parseInt(IEVersion()) <= 10) {
    str.push('<iframe name="targetIfr" id="targetIfr" style="display:none"></iframe>');
    str.push('<form id="importForm" action="import_mod_config.cgi" method="post" target="targetIfr" onsubmit="return checkFile(0)" name="importForm" enctype="multipart/form-data">');
    str.push('<input type="file" id="upload_file" name="upload_file" style="display:none; border: 1px solid rgb(169, 169, 169)" onChange="changeFileName(0, \'upload_file\',\'upload_file_tmp\')">');
    str.push('<input type="text" id="upload_file_tmp" readonly style="border: 1px solid rgb(169, 169, 169)"/>');
    str.push('<input type="button" id="importBrower" onclick="document.importForm.upload_file.click()" value="Brower">');
    str.push('<input type="submit" id="btnImport" value="Import">');
    str.push('</form>');
} else {
    str.push('<form id="importForm" name="importForm" enctype="multipart/form-data">');
    str.push('<input type="file" id="upload_file" name="upload_file"style="display:none; border: 1px solid rgb(169, 169, 169)" onChange="changeFileName(0, \'upload_file\',\'upload_file_tmp\')">');
    str.push('<input type="text" id="upload_file_tmp" readonly style="border: 1px solid rgb(169, 169, 169)"/>');
    str.push('<input type="button" id="importBrower" onclick="document.importForm.upload_file.click()" value="Brower">');
    str.push('<input type="button" id="btnImport" value="Import" onclick="importFile(\'upload_file\',\'import_mod_config.cgi\',0)">');
    str.push('</form>');
}
$('.import').innerHTML = str.join("");

//license导入
$('.licenseImport').innerHTML = '';
var str = [];
if (parseInt(IEVersion()) <= 10) {
    str.push('<iframe name="targetIfr1" id="targetIfr1" style="display:none"></iframe>');
    str.push('<form id="importForm1" action="import_license.cgi" method="post" target="targetIfr1" onsubmit="return checkFile(1)" name="importForm1" enctype="multipart/form-data">');
    str.push('<input type="file" id="upload_file1" name="upload_file1" style="display:none; border: 1px solid rgb(169, 169, 169)" onChange="changeFileName(1, \'upload_file1\',\'upload_file_tmp1\')">');
    str.push('<input type="text" id="upload_file_tmp1" readonly style="border: 1px solid rgb(169, 169, 169)"/>');
    str.push('<input type="button" id="importBrowerLicense" onclick="document.importForm1.upload_file1.click()" value="Brower">');
    str.push('<input type="submit" id="btnImport1" value="Import">');
    str.push('</form>');
} else {
    str.push('<form id="importForm1" name="importForm1" enctype="multipart/form-data">');
    str.push('<input type="file" id="upload_file1" name="upload_file1" style="display:none; border: 1px solid rgb(169, 169, 169)" onChange="changeFileName(1, \'upload_file1\',\'upload_file_tmp1\')">');
    str.push('<input type="text" id="upload_file_tmp1" readonly style="border: 1px solid rgb(169, 169, 169)"/>');
    str.push('<input type="button" id="importBrowerLicense" onclick="document.importForm1.upload_file1.click()" value="Brower">');
    str.push('<input type="button" id="btnImport1" value="Import" onclick="importFile(\'upload_file1\',\'import_license.cgi\',1)">');
    str.push('</form>');
}
$('.licenseImport').innerHTML = str.join("");

function changeFileName(type, fileID, tempID) {
    var file = document.getElementById(fileID).value;
    var strFileName = file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1");  //正则表达式获取文件名，不带后缀
    var FileExt = file.replace(/.+\./, "");   //正则表达式获取后缀
    var fileName = strFileName + '.' + FileExt;
    var arr = fileName.split(".");
    if(type === 0){
        if (arr.length < 2 || arr[arr.length - 1].toLowerCase() !== "json") {
            alert("Configuration file type error, Please reselect! (.json)", -1);
            return false;
        }
    }else{
        if (arr.length < 2 || arr[arr.length - 1].toLowerCase() !== "license") {
            alert("License file type error, Please reselect! (.license)", -1);
            return false;
        }
    }

    document.getElementById(tempID).value = fileName;
}

//IE9-IE10
function checkFile(type) {
    if(checkFileEmpty(type)){
        g_showLoading();
        setTimeout(function () {
            g_hideLoading();
        }, 7000);
        return true;
    }
    return false;
}

function importFile(fileID, url, type) {

    if(checkFileEmpty(type)){
		//准备FormData对象
		var formData = new FormData();
		var uploadFile = document.getElementById(fileID);
		//将文件放入FormData对象中
		formData.append(fileID, uploadFile.files[0]);

		ajax({
			type: "POST",
			dataType: "json",
			url: url,
			isUploadFile: true,
			data: formData,
			success: function () {
			    alert('Import Success!', 0);
			}
		});
	}
}

function checkFileEmpty(type) {
	//0:代表参数配置导入 1: 代表license导入
	if(type === 0){
		if (document.importForm.upload_file.value === "") {
			alert("Please select a file!", -1);
			return false;
		}
	}else {
		if (document.importForm1.upload_file1.value === "") {
			alert("Please select a file!", -1);
			return false;
		}
	}
	return true;
}