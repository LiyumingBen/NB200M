var nav_box = document.getElementsByClassName("nav_box")[0];
var bg = document.getElementsByClassName("bg")[0];
var currentLocationTip = document.getElementsByClassName("currentLocationTip")[0];
function toggleNav() {
    if (!nav_box.className.match(/(\s+|^)nav_hide(\s+|$)/)) {
        nav_box.className += " nav_hide";
        bg.style.display = "none";
    } else {
        nav_box.className = nav_box.className.replace("nav_hide", "");
        bg.style.display = "block";
    }
}

function hideNav() {
    if (!nav_box.className.match(/(\s+|^)nav_hide(\s+|$)/)) {
        nav_box.className += " nav_hide";
    }
    bg.style.display = "none";
}

// 改变焦点颜色
var a_navs = document.getElementsByTagName("a");
for (var i = 0; i < a_navs.length; i++) {
    (function (i) {
        a_navs[i].onclick = function () {
            a_navs[i].style.color = 'rgb(255, 255, 255)';
            var arrhref = (a_navs[i].href).split("/");
            for (var j = 0; j < arrhref.length; j++) {
                ohref = arrhref[arrhref.length - 1];
            }

            switch (ohref) {
                case "Status.html":
                    currentLocationTip.innerHTML = "Current location: Status";
                    break;
                case "EncoderSettings.html":
                    currentLocationTip.innerHTML = "Current location: Encoder Settings";
                    break;
                case "SystemSettings.html":
                    currentLocationTip.innerHTML = "Current location: System Settings";
                    break;
            }
            bg.style.display = "none";
            if (!nav_box.className.match(/(\s+|^)nav_hide(\s+|$)/)) {
                nav_box.className += " nav_hide";
            } else {
                nav_box.className.replace("nav_hide", "");
            }

            for (var j = 0; j < a_navs.length; j++) {
                if (i !== j) {
                    a_navs[j].style.color = 'rgb(190, 190, 190)';
                }
            }
        };
    })(i);
}

function Logout() {
    localStorage.removeItem("name");
    window.location.href = "Login.html?s=" + getUUID();
}

$('.admin').innerHTML = localStorage.getItem("name");