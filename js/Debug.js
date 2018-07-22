var url = document.getElementById("i_ipt_url").value;
var method = document.getElementById("i_slt_method").value;
var data = document.getElementById("i_ipt_data").value;
var Response_Status = document.getElementById("i_ipt_status");
var Response_Data = document.getElementById("i_ipt_rData");
function sendData() {
    ajax({
        type: "POST",
        dataType: "json",
        url: "Debug.cgi",
        data: {
            "url": url,
            "method": method,
            "data": data
        },
        success: function (str) {
            var obj = JSON.parse(str);
            if (typeof obj !== "undefined" && typeof obj["code"] !== "undefined" && obj["code"] === 0) {
                console.log(obj.data['status']);
                if (parseInt(obj.data['status']) === 0) {
                    Response_Status.value = "Successed";
                    Response_Status.style.color = "rgb(0,128,0)";
                } else {
                    Response_Status.value = "Failed";
                    Response_Status.style.color = "rgb(255, 1, 1)";
                }
                Response_Data.value = JSON.stringify(obj.data['data'].url);
            }
            alert("success");
        }
    });
}