get_modulate_info();

function get_modulate_info(mode) {
    var url = typeof(mode) === 'undefined' ? "modulate_info.cgi" : "modulate_info.cgi?mode=" + mode;
    ajax({
        type: "GET",
        dataType: "json",
        url: url,
        success: function (str) {
            var obj = JSON.parse(str);
            if (typeof obj !== "undefined" && typeof obj["code"] !== "undefined" && obj["code"] === 0) {

                init_mod_mode(obj);
                init_constellation(obj);
                init_frequency(obj);

                init_video_profile(obj);
                init_videoMinBitrate(obj);
                init_videoMaxBitrate(obj);
                init_latency(obj);
                init_gop(obj);
                init_min_quant(obj);
                init_max_quant(obj);

                init_encodeType(obj);
                init_encodeStatus(obj);
                init_audioEncodeType(obj);

                init_provider(obj);
                init_service_name(obj);
                init_pmt_pid(obj);
                init_video_pid(obj);
                init_network_id(obj);
                init_audio_pid(obj);
                init_service_id(obj);
            }
        }
    });
}

function handle_mod_mode_change() {
    get_modulate_info(Number($(".mod_mode").value));
}

function handle_video_profile_change() {
    init_video_profile();
}

function handle_constellation_change() {
    init_sync_frame();
    handle_sync_frame_change();
}

function handle_sync_frame_change() {
    init_carrier();
    init_rate();
    init_interleave();
}

//mod_mode
function init_mod_mode(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["mod_mode"];
    } else {
        value = $(".mod_mode").value;
    }

    options = [
        {val: 0, txt: "DVB-C(J83-A)"},
        {val: 1, txt: "ATSC"},
        {val: 2, txt: "DTMB"},
        {val: 3, txt: "DVB-T"},
        {val: 4, txt: "ISDB-T"},
        {val: 5, txt: "QAM(J83-B)"}
    ];

    initSelect($(".mod_mode"), options, value);

    batch_toggle_show("DVBC", false);
    batch_toggle_show("DVBT", false);
    batch_toggle_show("ISDBT", false);
    batch_toggle_show("DTMB", false);

    switch (parseInt($(".mod_mode").value)) {
        case 0: //DVB-C
            batch_toggle_show("DVBC", true);
            init_symbolRate(data);
            break;
        case 2: //DTMB
            batch_toggle_show("DTMB", true);
            init_carrier(data);
            init_rate(data);
            init_sync_frame(data);
            init_pn_phase(data);
            init_interleave(data);
            init_bandwidth(data);
            break;
        case 3: // DVB-T
            batch_toggle_show("DVBT", true);
            init_FEC(data);
            init_carrier_num(data);
            init_guard_interval(data);
            init_bandwidth(data);
            break;
        case 4: //ISDB-T
            batch_toggle_show("ISDBT", true);
            init_fft_mode(data);
            init_code_rate(data);
            init_guard_interval(data);
            init_time_interleave(data);
            init_bandwidth(data);
            break;
    }
}

function init_constellation(data) {
    var options = [];
    var value;
    var mod_mode;
    if (typeof data !== 'undefined') {
        mod_mode = data["mod_mode"];
        value = data["mod_params"]["constellation"];
    } else {
        mod_mode = $(".mod_mode").value;
        value = $(".constellation").value;
    }
    //联动处理
    switch (Number(mod_mode)) {
        case 0: //DVB-C
            options.push({val: 0, txt: "16-QAM"});
            options.push({val: 1, txt: "32-QAM"});
            options.push({val: 2, txt: "64-QAM"});
            options.push({val: 3, txt: "128-QAM"});
            options.push({val: 4, txt: "256-QAM"});
            break;
        case 1: //ATSC
            options.push({val: 0, txt: "8VSB"});
            break;
        case 2: //DTMB
            options.push({val: 0, txt: "QPSK"});
            options.push({val: 1, txt: "16-QAM"});
            options.push({val: 2, txt: "64-QAM"});
            /*options.push({val:3, txt:"NR-QAM4"});*/
            options.push({val: 4, txt: "32-QAM"});
            break;
        case 3: // DVB-T
            options.push({val: 0, txt: "QPSK"});
            options.push({val: 2, txt: "16-QAM"});
            options.push({val: 4, txt: "64-QAM"});
            break;
        case 4: //ISDB
            options.push({val: 1, txt: "QPSK"});
            options.push({val: 2, txt: "16-QAM"});
            options.push({val: 3, txt: "64-QAM"});
            break;
        case 5: //QAM
            options.push({val: 1, txt: "64-QAM"});
            options.push({val: 3, txt: "256-QAM"});
            break;
    }
    initSelect($(".constellation"), options, value);
}

function init_frequency(data) {
    if (typeof data !== 'undefined') {
        $(".frequency").value = data["mod_params"]["frequency"];
    }
}

function init_symbolRate(data) {
    if (typeof data !== 'undefined') {
        $(".symbolRate").value = data["mod_params"]["symbol_rate"];
    }
}

function init_bandwidth(data) {
    if (typeof data !== 'undefined') {
        $(".bandwidth").value = data["mod_params"]["bandwidth"];
    }
}

function init_FEC(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["mod_params"]['fec'];
    } else {
        value = $(".FEC").value;
    }

    options = [
        {val: 0, txt: "1/2"},
        {val: 1, txt: "2/3"},
        {val: 2, txt: "3/4"},
        {val: 3, txt: "5/6"},
        {val: 4, txt: "7/8"}
    ];

    initSelect($(".FEC"), options, value);
}

function init_carrier_num(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["mod_params"]['carrier_num'];
    } else {
        value = $(".carrier_num").value;
    }

    options = [
        {val: 0, txt: "FFT2K"},
        {val: 1, txt: "FFT8K"}
    ];

    initSelect($(".carrier_num"), options, value);
}

function init_guard_interval(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["mod_params"]['guard_interval'];
    } else {
        value = $(".guard_interval").value;
    }

    options = [
        {val: 0, txt: "1/32"},
        {val: 1, txt: "1/16"},
        {val: 2, txt: "1/8"},
        {val: 3, txt: "1/4"}
    ];

    initSelect($(".guard_interval"), options, value);
}

function init_fft_mode(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["mod_params"]['mode'];
    } else {
        value = $(".fft_mode").value;
    }

    options = [
        {val: 0, txt: "2K"},
        {val: 1, txt: "8K"},
        {val: 2, txt: "4K"}
    ];

    initSelect($(".fft_mode"), options, value);
}

function init_code_rate(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["mod_params"]['code_rate'];
    } else {
        value = $(".code_rate").value;
    }

    options = [
        {val: 0, txt: "1/2"},
        {val: 1, txt: "2/3"},
        {val: 2, txt: "3/4"},
        {val: 3, txt: "5/6"},
        {val: 4, txt: "7/8"}
    ];

    initSelect($(".code_rate"), options, value);
}

function init_time_interleave(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["mod_params"]['time_interleave'];
    } else {
        value = $(".time_interleave").value;
    }

    options = [
        {val: 0, txt: "interleave 0"},
        {val: 1, txt: "interleave 1"},
        {val: 2, txt: "interleave 2"},
        {val: 3, txt: "interleave 3"}
    ];
    initSelect($(".time_interleave"), options, value);
}

function init_rate(data) {
    var options = [];
    var value, mod_mode, constellation;
    if (typeof data !== 'undefined') {
        sync_frame = data["mod_params"]["sync_frame"];
        constellation = data["mod_params"]["constellation"];
        value = data["mod_params"]['rate'];
    } else {
        sync_frame = $(".sync_frame").value;
        constellation = $(".constellation").value;
        value = $(".rate").value;
    }

    if (Number(constellation) == 0 || Number(constellation) == 4) {
        options = [
            {val: 2, txt: "0.8"}
        ];
    } else if (Number(constellation) == 2) {
        if (Number(sync_frame) == 0) {
            options = [
                {val: 1, txt: "0.6"},
                {val: 2, txt: "0.8"}
            ];
        } else {
            options = [
                {val: 1, txt: "0.6"}
            ];
        }
    } else if (Number(constellation) == 1) {
        if (Number(sync_frame) == 1) {
            options = [
                {val: 0, txt: "0.4"},
                {val: 1, txt: "0.6"},
                {val: 2, txt: "0.8"}
            ];
        } else {
            options = [
                {val: 2, txt: "0.8"}
            ];
        }
    } else {
        options = [
            {val: 0, txt: "0.4"},
            {val: 1, txt: "0.6"},
            {val: 2, txt: "0.8"}
        ];
    }

    initSelect($(".rate"), options, value);
}

function init_sync_frame(data) {
    var options = [];
    var value, mod_mode, constellation;
    if (typeof data !== 'undefined') {
        mod_mode = data["mod_mode"];
        constellation = data["mod_params"]["constellation"];
        value = data["mod_params"]['sync_frame'];
    } else {
        mod_mode = $(".mod_mode").value;
        constellation = $(".constellation").value;
        value = $(".sync_frame").value;
    }

    if (Number(mod_mode) == 2) {
        switch (Number(constellation)) {
            case 0:
                options = [{val: 2, txt: "SYNC 595"}];
                break;
            case 1:
                options = [
                    {val: 0, txt: "SYNC 420"},
                    {val: 1, txt: "SYNC 945"},
                    {val: 2, txt: "SYNC 595"}
                ];
                break;
            case 2:
                options = [
                    {val: 0, txt: "SYNC 420"},
                    {val: 1, txt: "SYNC 945"}
                ];
                break;
            case 4:
                options = [{val: 2, txt: "SYNC 595"}];
                break;
        }
    } else {
        options = [
            {val: 0, txt: "SYNC 420"},
            {val: 1, txt: "SYNC 945"},
            {val: 2, txt: "SYNC 595"}
        ];
    }

    initSelect($(".sync_frame"), options, value);
}

function init_pn_phase(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["mod_params"]['pn_phase'];
    } else {
        value = $(".pn_phase").value;
    }

    options = [
        {val: 0, txt: "Va Phase"},
        {val: 1, txt: "Co Phase"}
    ];

    initSelect($(".pn_phase"), options, value);
}

function init_interleave(data) {
    var options = [];
    var value, mod_mode;
    if (typeof data !== 'undefined') {
        mod_mode = data["mod_mode"];
        value = data["mod_params"]['interleave'];
    } else {
        mod_mode = $(".mod_mode").value;
        value = $(".interleave").value;
    }
    if (Number(mod_mode) == 2) {
        options = [
            {val: 3, txt: "720"}
        ];
    } else {
        options = [
            {val: 0, txt: "None"},
            {val: 2, txt: "240"},
            {val: 3, txt: "720"}
        ];
    }

    initSelect($(".interleave"), options, value);
}

function init_carrier(data) {
    var options = [];
    var value, sync_frame, constellation;
    if (typeof data !== 'undefined') {
        sync_frame = data["mod_params"]["sync_frame"];
        constellation = data["mod_params"]["constellation"];
        value = data["mod_params"]['carrier'];
    } else {
        sync_frame = $(".sync_frame").value;
        constellation = $(".constellation").value;
        value = $(".carrier").value;
    }
    if (Number(constellation) == 0 || Number(constellation) == 4) {
        options = [
            {val: 1, txt: "single-carrier"}
        ];
    } else if (Number(constellation) == 2) {
        options = [
            {val: 0, txt: "multi-carrier"}
        ];
    } else if (Number(constellation) == 1) {
        if (Number(sync_frame) == 2) {
            options = [
                {val: 1, txt: "single-carrier"}
            ];
        } else {
            options = [
                {val: 0, txt: "multi-carrier"}
            ];
        }
    } else {
        options = [
            {val: 0, txt: "multi-carrier"},
            {val: 1, txt: "single-carrier"}
        ];
    }
    initSelect($(".carrier"), options, value);
}

function init_video_profile(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["video_profile"]['type'];
    } else {
        value = $(".video_profile").value;
    }

    options = [
        {val: 0, txt: "normal"},
        {val: 1, txt: "sport"},
        {val: 2, txt: "userdefine"}
    ];

    initSelect($(".video_profile"), options, value);

    switch (parseInt($(".video_profile").value)) {
        case 0:
        case 1:
            batch_toggle_show("profile", false);
            break;
        default:
            batch_toggle_show("profile", true);
            break;
    }
}

function init_videoMinBitrate(data) {
    if (typeof data !== 'undefined') {
        $(".videoMinBitrate").value = data["video_profile"]["min_bitrate"];
    }
}
function init_videoMaxBitrate(data) {
    if (typeof data !== 'undefined') {
        $(".videoMaxBitrate").value = data["video_profile"]["max_bitrate"];
    }
}
function init_latency(data) {
    if (typeof data !== 'undefined') {
        $(".latency").value = data["video_profile"]["latency"];
    }
}
function init_gop(data) {
    if (typeof data !== 'undefined') {
        $(".gop").value = data["video_profile"]["gop"];
    }
}
function init_min_quant(data) {
    if (typeof data !== 'undefined') {
        $(".min_quant").value = data["video_profile"]["min_quant"];
    }
}
function init_max_quant(data) {
    if (typeof data !== 'undefined') {
        $(".max_quant").value = data["video_profile"]["max_quant"];
    }
}

function init_encodeType(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["encode"]['encode_type'];
    } else {
        value = $(".encodeType").value;
    }

    options = [
        {val: 2, txt: "1080P to I"}
    ];

    initSelect($(".encodeType"), options, value);
}

function init_encodeStatus(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["encode"]['status'];
    } else {
        value = $(".encodeStatus").value;
    }

    options = [
        {val: 0, txt: "Disable"},
        {val: 1, txt: "Enable"}
    ];

    initSelect($(".encodeStatus"), options, value);
}

function init_audioEncodeType(data) {
    var options = [];
    var value;
    if (typeof data !== 'undefined') {
        value = data["audio_codec"];
        var AC3_Auth = data['ac3_authorized'];
    } else {
        value = $(".audioEncodeType").value;
    }
    options = [
        {val: 0, txt: "AUTO"},
        {val: 1, txt: "AC-3"},
        {val: 2, txt: "AAC-LC"},
        {val: 3, txt: "MPI LAYER II"}
    ];

    if(!AC3_Auth){
        options.splice(1,1);
    }
    initSelect($(".audioEncodeType"), options, value);
}


function init_provider(data) {
    if (typeof data !== 'undefined') {
        $(".provider").value = data["stream"]["provider"];
    }
}
function init_service_name(data) {
    if (typeof data !== 'undefined') {
        $(".service_name").value = data["stream"]["service_name"];
    }
}
function init_pmt_pid(data) {
    if (typeof data !== 'undefined') {
        $(".pmt_pid").value = data["stream"]["pmt_pid"];
    }
}
function init_video_pid(data) {
    if (typeof data !== 'undefined') {
        $(".video_pid").value = data["stream"]["video_pid"];
    }
}
function init_network_id(data) {
    if (typeof data !== 'undefined') {
        $(".network_id").value = data["stream"]["network_id"];
    }
}
function init_audio_pid(data) {
    if (typeof data !== 'undefined') {
        $(".audio_pid").value = data["stream"]["audio_pid"];
    }
}
function init_service_id(data) {
    if (typeof data !== 'undefined') {
        $(".service_id").value = data["stream"]["service_id"];
    }
}


function batch_toggle_show(className, show) {
    var list = document.getElementsByClassName(className);
    for (var i = 0; i < list.length; i++) {
        list[i].style.display = show ? "" : "none";
    }
}

function setModulateInfo() {

    var o = {
        "mod_mode": parseInt($('.mod_mode').value),
        "video_input": parseInt($('.MediaInput_video').value),
        "audio_input": parseInt($('.MediaInput_audio').value),
        "mod_params": {
            "constellation": parseInt($('.constellation').value),
            "symbol_rate": parseInt($('.symbolRate').value),
            "frequency": parseInt($('.frequency').value),
            "fec": parseInt($('.FEC').value),
            "carrier_num": parseInt($('.carrier_num').value),
            "bandwidth": parseInt($('.bandwidth').value),
            "mode": parseInt($('.fft_mode').value),
            "guard_interval": parseInt($('.guard_interval').value),
            "code_rate": parseInt($('.code_rate').value),
            "time_interleave": parseInt($('.time_interleave').value),
            "rate": parseInt($('.rate').value),
            "sync_frame": parseInt($('.sync_frame').value),
            "pn_phase": parseInt($('.pn_phase').value),
            "interleave": parseInt($('.interleave').value),
            "carrier": parseInt($('.carrier').value)
        },
        "video_profile": {
            "type": parseInt($('.video_profile').value),
            "min_bitrate": parseInt($('.videoMinBitrate').value),
            "max_bitrate": parseInt($('.videoMaxBitrate').value),
            "latency": parseInt($('.latency').value),
            "gop": parseInt($('.gop').value),
            "min_quant": parseInt($('.min_quant').value),
            "max_quant": parseInt($('.max_quant').value)
        },
        "encode": {
            "encode_type": parseInt($('.encodeType').value),
            "status": parseInt($('.encodeStatus').value)
        },
        "audio_codec": parseInt($('.audioEncodeType').value),
        "stream": {
            "provider": $('.provider').value,
            "service_name": $('.service_name').value,
            "pmt_pid": parseInt($('.pmt_pid').value),
            "video_pid": parseInt($('.video_pid').value),
            "audio_pid": parseInt($('.audio_pid').value),
            "service_id": parseInt($('.service_id').value),
            "network_id": parseInt($('.network_id').value)
        }
    };

    //PID参数校验
    if ((parseInt($('.pmt_pid').value) === parseInt($('.video_pid').value))
        || (parseInt($('.pmt_pid').value) === parseInt($('.audio_pid').value))
        || (parseInt($('.video_pid').value) === parseInt($('.audio_pid').value))) {
        alert("PID Conflict");
        return false;
    }

    //参数校验

    for (var key in o) {
        switch (key) {
            case "mod_params":
                if (o.mod_mode === 0) {
                    for (var modParamsKey in o.mod_params) {
                        switch (modParamsKey) {
                            case "symbol_rate":
                                if (o.mod_params['symbol_rate'] < 3600 || o.mod_params['symbol_rate'] > 6952) {
                                    alert("Symbolrate input error, symbolrate length range[3600,6952]", 9);
                                    return false;
                                }
                                break;
                        }
                    }
                }

                if (o.mod_mode === 2 || o.mod_mode === 3 || o.mod_mode === 4) {
                    for (var modParamsKey in o.mod_params) {
                        switch (modParamsKey) {
                            case "bandwidth":
                                if (o.mod_params['bandwidth'] < 2 || o.mod_params['bandwidth'] > 8) {
                                    alert("Bandwidth input error, bandwidth length range:[2,8]", 9);
                                    return false;
                                }
                                break;
                        }
                    }
                }

                for (var modParamsKey in o.mod_params) {
                    switch (modParamsKey) {
                        case "frequency":
                            if (o.mod_params['frequency'] < 50 || o.mod_params['frequency'] > 1000) {
                                alert("Frequency input error, frequency length range:[50,1000]", 9);
                                return false;
                            }
                            break;
                    }
                }

                break;
            case "video_profile":
                if (o.video_profile['type'] === 2) {
                    for (var videoProfileKey in o.video_profile) {
                        switch (videoProfileKey) {
                            case "min_bitrate":
                                if (o.video_profile['min_bitrate'] < 2000 || o.video_profile['min_bitrate'] > 50000) {
                                    alert("Min Bitrate input error, min bitrate length range:[2000,50000]", 9);
                                    return false;
                                }
                                break;
                            case "max_bitrate":
                                if (o.video_profile['max_bitrate'] < 2000 || o.video_profile['max_bitrate'] > 50000) {
                                    alert("Max Bitrate input error, max bitrate length range:[2000,50000]", 9);
                                    return false;
                                }
                                break;
                            case "latency":
                                if (o.video_profile['latency'] < 0 || o.video_profile['latency'] > 1000) {
                                    alert("Latency input error, latency length range:[0,1000]", 9);
                                    return false;
                                }
                                break;
                            case "gop":
                                if (o.video_profile['gop'] < 1 || o.video_profile['gop'] > 60) {
                                    alert("GOP input error, GOP length range:[1,60]", 9);
                                    return false;
                                }
                                break;
                            case "min_quant":
                                if (o.video_profile['min_quant'] < 1 || o.video_profile['min_quant'] > 31) {
                                    alert("Min Quant input error, min quant length range:[1,31]", 9);
                                    return false;
                                }
                                break;
                            case "max_quant":
                                if (o.video_profile['max_quant'] < 1 || o.video_profile['max_quant'] > 31) {
                                    alert("Max Quant input error, max quant length range:[1,31]", 9);
                                    return false;
                                }
                                break;
                        }
                    }
                }
                break;
            case "stream":
                for (var streamKey in o.stream) {
                    switch (streamKey) {
                        case "pmt_pid":
                            if (o.stream['pmt_pid'] < 32 || o.stream['pmt_pid'] > 8190) {
                                alert("PMT PID input error, PMT PID length range:[32,8190]", 9);
                                return false;
                            }
                            break;
                        case "video_pid":
                            if (o.stream['video_pid'] < 32 || o.stream['video_pid'] > 8190) {
                                alert("Video PID input error, video PID length range:[32,8190]", 9);
                                return false;
                            }
                            break;
                        case "audio_pid":
                            if (o.stream['audio_pid'] < 32 || o.stream['audio_pid'] > 8190) {
                                alert("Audio PID input error, audio PID length range:[32,8190]", 9);
                                return false;
                            }
                            break;
                        case "service_id":
                            if (o.stream['service_id'] < 0 || o.stream['service_id'] > 65535) {
                                alert("Service ID input error, service ID length range:[0,65535]", 9);
                                return false;
                            }
                            break;
                        case "network_id":
                            if (o.stream['network_id'] < 0 || o.stream['network_id'] > 65535) {
                                alert("Network ID input error, network ID length range:[0,65535]", 9);
                                return false;
                            }
                            break;
                    }
                }
                break;
        }
    }

    ajax({
        type: "POST",
        dataType: "json",
        url: "modulate_info.cgi",
        data: o,
        success: function () {
            alert("Setting Success!", 0);
            get_modulate_info();
        }
    });
}