var HDMI_Resolution = document.getElementsByClassName("HDMI_Resolution")[0];
getInputInfo();

function getInputInfo() {
    ajax({
        type: "GET",
        dataType: "json",
        url: "input_info.cgi",
        success: function (str) {
            var obj = JSON.parse(str);
            if (typeof obj !== "undefined" && typeof obj["code"] !== "undefined" && obj["code"] === 0) {
                HDMI_Resolution.value = obj["hdmi_resolution"];
            }
        }
    });
}