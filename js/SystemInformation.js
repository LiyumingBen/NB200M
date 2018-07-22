var softWare_Version = document.getElementsByClassName("SoftWare_Version")[0];
var hardWare_Version = document.getElementsByClassName("HardWare_Version")[0];
var firmWare_Version = document.getElementsByClassName("FirmWare_Version")[0];

getStatus();

function getStatus() {
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
            }
        }
    });
}
