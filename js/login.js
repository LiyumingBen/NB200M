var userName = document.getElementsByClassName("user")[0];
var Password = document.getElementsByClassName("password")[0];
var remind_userName = document.getElementById("remind_1");
var remind_Password = document.getElementById("remind_2");
remind_userName.style.visibility = 'hidden';
remind_Password.style.visibility = 'hidden';

//用户框失去焦点后验证value值
function oBlur_1() {
    if (userName.value === '') { //用户框value值为空
        remind_userName.style.visibility = 'visible';
    } else { //用户框value值不为空
        remind_Password.style.visibility = 'hidden';
    }
}

//密码框失去焦点后验证value值
function oBlur_2() {
    if (Password.value === '') { //密码框value值为空
        remind_Password.style.visibility = 'visible';
    } else { //密码框value值不为空
        remind_Password.style.visibility = 'hidden';
    }
}

//用户框获得焦点的隐藏提醒
function oFocus_1() {
    remind_userName.style.visibility = 'hidden';
}

//密码框获得焦点的隐藏提醒
function oFocus_2() {
    remind_Password.style.visibility = 'hidden';
}


//若输入框为空，阻止表单的提交
function login() {
    if (parseInt(IEVersion()) < 9) {
        alert("The browser version is too low", 8);
        return false;
    }
    if (!userName.value) { //用户框value值为空
        remind_userName.style.visibility = 'visible';
        return false;
    }

    if (!Password.value) { //密码框value值为空
        remind_Password.style.visibility = 'visible';
        return false;
    }

    ajax({
        url: "login.cgi",
        type: "POST",
        dataType: "json",
        data: {
            'name': userName.value,
            'pwd': Password.value
        },
        success: function () {
            localStorage.setItem("name",userName.value);
            window.location = "index.html?tmp=" + getUUID();
        }
    });
}



