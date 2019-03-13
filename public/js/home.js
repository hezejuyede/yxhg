window.onload = function () {
    getLeftNav();
    getHome();
    getDivWidth();
    screenInfo();
    getMaxMin();
    getObjectValue();
    setMessageHeight();
    screenWidth();

};
//全局定义定时器
var timer;

//根据浏览器固定宽度设置页面固定大小
function screenWidth() {userLogin
    var W = $(window).width();
    var YWHome = $("#YWHome");
    var userLogin = $("#userLogin")
    if (W < 1200) {
        YWHome.css("width","1200px");

    }
}

//判断用户是否登录
function getHome() {

    var NowUserStates = localStorage.getItem("UserStates");
    var NowUserInfos = localStorage.getItem("userInfos");
    NowUserInfos = JSON.parse(NowUserInfos);
    NowUserStates = JSON.parse(NowUserStates);

    if (NowUserStates === null) {
        $("#noLogin").append(" <a href=\"/admLogin.html\"><img src='../icon/yh.png' style='height: 20px;margin-right: 10px'></img><span>管理员登录</span></a>");
        $("#noLogin").append(" <a href=\"/loginIndex.html\"><img src='../icon/adm.png' style='height: 20px;margin-right: 10px'></img><span>普通用户登录</span></a>");

    }
    else if (NowUserStates === 1) {
        $("#login").append("<div class=\"userName\" id=\"userName\"><img src='../icon/yh.png' style='height: 20px;margin-right: 10px'></img><span>" + NowUserInfos.username + "</span></div><div class=\"outLogin\"><img src='../icon/tc.png' style='height: 20px;margin-right: 5px'></img><span id=\"outLogin\">退出登录</span></div>");
    }
    else if (NowUserStates === 2) {
        $("#login").append("<div class=\"userName\" id=\"userName\"><img src='../icon/yh.png' style='height: 20px;margin-right: 10px'></img><span>" + NowUserInfos.username + "</span></div><div class=\"outLogin\"><img src='../icon/tc.png' style='height: 20px;margin-right: 5px'></img><span id=\"outLogin\">退出登录</span></div>");
        $("#login").prepend("<div class=\"outLogin\"><img src='../icon/Message.png' style='height: 20px;margin-right: 5px'></img><span id=\"Message\">留言反馈</span></div>");
    }

}


//动态获得 左中右的高度
function getDivWidth() {
    var w = document.body.scrollHeight;
    var left = document.getElementById("main-left");
    var center = document.getElementById("main-center");
    var right = document.getElementById("main-right");
    var main = document.getElementById("main");
    main.style.height = (w - 60) + "px";
    left.style.height = (w - 60) + "px";
    center.style.height = (w - 60) + "px";
    right.style.height = (w - 60) + "px";
}

// 根据屏幕分辨率判断是否显示左右两侧
function screenInfo() {
    var H = window.screen.height;
    var W = window.screen.width;
    var center = $("#main-center");
    var L = document.getElementById("main-left");
    var R = document.getElementById("main-right");
    var F = W / H;
    if (F > 1.24 && F < 1.4) {
        L.style.display = "none";
        R.style.display = "none";
        center.css("width", "100%");
    }
}


//加载判断哪个object
function getObjectValue() {
    var URL = localStorage.getItem("URL");
    u = JSON.parse(URL);
    url = encodeURI(u);
    if (URL == null || URL == "") {
        $("#iframe").html("<object classid=\"clsid:4F26B906-2854-11D1-9597-00A0C931BFC8\" id=\"Pbd1\" width=\"100%\" height=\"100%\"><param name=\"_cx\" value=\"24262\"><param name=\"_cy\" value=\"16140\"><param name=\"ServerIniURL\" value><param name=\"DisplayURL\" value='http://192.168.1.12/piweb/0001.PDI'></object>")
    }
    else {
        $("#iframe").html("<object classid=\"clsid:4F26B906-2854-11D1-9597-00A0C931BFC8\" id=\"Pbd1\" width=\"100%\" height=\"100%\"><param name=\"_cx\" value=\"24262\"><param name=\"_cy\" value=\"16140\"><param name=\"ServerIniURL\" value><param name=\"DisplayURL\" value='http://192.168.1.12/piweb/YWGA/" + url + ".PDI'></object>")
    }

}


//根据不同的分辨率动态显示右侧输入框大小
function setMessageHeight() {
    var message = $("#txt");
    var H = window.screen.height;
    var W = window.screen.width;
    if (H <= 800 && W <= 1050) {
        message.css("height", "50px");
    }
    else if (H >= 800 && H <= 900 && W <= 1600 && W >= 1100) {
        message.css("height", "100px");
    }
    else if (H >= 900 && H <= 1050 && W >= 1400 && W <= 1600) {
        message.css("height", "120px");
    }
    else if (H > 1050 && W > 1600) {
        message.css("height", "200px");
    }
    else if (H >= 1279 && W >= 1024) {
        message.css("height", "250px");
    }
    else {
        message.css("height", "60px");
    }


}


//需要进行前后台交互的区域开始


//向后台动态请求左侧树状导航栏地址
function getLeftNav() {
    jQuery.ajax({
        type: 'POST',
        url: 'HomeLeftNav',
        contentType: "application/x-www-form-urlencoded",
        dataType: 'json',
        success: function (data) {
            var setting = {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: ""
                    }
                },
                view: {
                    dblClickExpand: false
                },
                callback: {
                    onClick: zTreeOnClick
                }
            };

            function zTreeOnClick(event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("tree");
                zTree.expandNode(treeNode);
                nodes = zTree.getSelectedNodes();
                var node = nodes[0];
                if (!node.isParent) {
                    function getFilePath(treeObj) {
                        if (treeObj == null) return "";
                        var filename = treeObj.name;
                        var pNode = treeObj.getParentNode();
                        if (pNode != null) {
                            filename = getFilePath(pNode) + "/" + filename;
                        }
                        return filename;
                    }
                    jQuery.ajax({
                        type: 'POST',
                        url: 'getObjectData',
                        data: {
                            "name": getFilePath(treeNode),
                        },
                        contentType: "application/x-www-form-urlencoded",
                        dataType: 'json',
                        success: function (data) {
                            var URL = data;
                            URL = JSON.stringify(URL);
                            localStorage.setItem("URL", URL);
                            var url = localStorage.getItem("URL", URL);
                            u = JSON.parse(url);
                            url = encodeURI(u);
                            $("#iframe").html("<object classid=\"clsid:4F26B906-2854-11D1-9597-00A0C931BFC8\" id=\"Pbd1\" width=\"100%\" height=\"100%\"><param name=\"_cx\" value=\"24262\"><param name=\"_cy\" value=\"16140\"><param name=\"ServerIniURL\" value><param name=\"DisplayURL\" value='http://192.168.1.12/piweb/YWGA/" + url + ".PDI'></object>")
                        }
                    });
                }
            }

            var t = $("#tree");
            var list = JSON.parse(data);
            t = $.fn.zTree.init(t, setting, list);
        }
    });

}


//页面加载获得最大值最小值
function getMaxMin() {
    var MaxMinValue = localStorage.getItem("MaxMinValue");
    if (MaxMinValue == null || MaxMinValue == "") {

    }
    else {
        var list = [];
        var jsonstrs = JSON.parse(MaxMinValue.substr(1, MaxMinValue.length));
        var valueList = jsonstrs.valueList;
        $("#MaxMinValueList").empty();
        $(valueList).each(function (index, e) {
            if (e.Monitor) {
                $("#MaxMinValueList").append("<div class=\"templateList\"><div class=\"templateList-left fl\"><img src=\"icon/ZQ.png\" alt=\"\"></div><div  class=\"templateList-center fl\"><span>" + e.Tag + "</span></div><div class=\"templateList-center-right fl\"><div class='right-img fl'><img src='../icon/start.png'></div><button class=\"Relieve fl\">删</button></div></div>");
                list.push(e)
            }
            else {
                $("#MaxMinValueList").append("<div class=\"templateList\"><div class=\"templateList-left fl\"><img src=\"icon/ZQ.png\" alt=\"\"></div><div  class=\"templateList-center fl\"><span>" + e.Tag + "</span></div><div class=\"templateList-center-right fl\"><div class='right-img fl'><img src='../icon/stop.png'></div><button class=\"Relieve fl\">删</button></div></div>");
            }
        });
        var Time = localStorage.getItem("time");
        if (Time === null || Time === "") {
            timer = setInterval(function setMaxMinValue() {
                jQuery.ajax({
                    type: 'GET',
                    url: 'http://10.176.124.10:8099/GetTagAlarm.ashx',
                    data: {"DATA": JSON.stringify(list)},
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback: "callBackName",
                    success: function (result) {
                        var Value = localStorage.getItem("MaxMinValue");
                        var jsonstrs = JSON.parse(Value.substr(1, Value.length));
                        var valueList = jsonstrs.valueList;
                        var centerList = $(".templateList-center");
                        var leftList = $(".templateList-left");
                        $(result).each(function (index, e) {
                            $(centerList).each(function (i, el) {
                                if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && e.NState === 1) {

                                    var I = $(".templateList-center").index(el);
                                    $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/GT.png\" ></div>");
                                    $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                }
                                else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && e.NState === 2) {

                                    var I = $(".templateList-center").index(el);
                                    $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/CW.png\" ></div>");
                                    $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                }
                                else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && e.NState === -1) {

                                    var I = $(".templateList-center").index(el);
                                    $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/GT.png\" ></div>");
                                    $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                }
                                else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && e.NState === -2) {

                                    var I = $(".templateList-center").index(el);
                                    $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/CW.png\" ></div>");
                                    $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");

                                }
                                $(valueList).each(function (ind, elm) {
                                    if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && el.innerText.toLowerCase() === elm.Tag.toLowerCase() && e.NState === -1 && elm.xx === true) {
                                        var I = $(".templateList-center").index(el);
                                        $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/GT.png\" ></div>");
                                        $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                        var Name = e.Tag;
                                        alert(Name + "已经低于下限值")


                                    }
                                    else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && el.innerText.toLowerCase() === elm.Tag.toLowerCase() && e.NState === 1 && elm.sx === true) {

                                        var I = $(".templateList-center").index(el);
                                        $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/GT.png\" ></div>");
                                        $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                        var Name = e.Tag;
                                        alert(Name + "已经高于上限值")

                                    }
                                    else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && el.innerText.toLowerCase() === elm.Tag.toLowerCase() && e.NState === 2 && elm.zd === true) {

                                        var I = $(".templateList-center").index(el);
                                        $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/CW.png\" ></div>");
                                        $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                        var Name = e.Tag;
                                        alert(Name + "已经超过最高值")
                                    }
                                    else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && el.innerText.toLowerCase() === elm.Tag.toLowerCase() && e.NState === -2 && elm.zx === true) {

                                        var I = $(".templateList-center").index(el);
                                        $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/CW.png\" ></div>");
                                        $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                        var Name = e.Tag;
                                        alert(Name + "已经低于最低值")


                                    }
                                })
                            })
                        });
                    }
                });
            }, 15000);
        }
        else {
            var DcTime = Number(Time) * 1000;
            timer = setInterval(function setMaxMinValue() {
                jQuery.ajax({
                    type: 'GET',
                    url: 'http://10.176.124.10:8099/GetTagAlarm.ashx',
                    data: {"DATA": JSON.stringify(list)},
                    dataType: "jsonp",
                    jsonp: "callback",
                    jsonpCallback: "callBackName",
                    success: function (result) {
                        var Value = localStorage.getItem("MaxMinValue");
                        var jsonstrs = JSON.parse(Value.substr(1, Value.length));
                        var valueList = jsonstrs.valueList;
                        var centerList = $(".templateList-center");
                        var leftList = $(".templateList-left");
                        $(result).each(function (index, e) {
                            $(centerList).each(function (i, el) {
                                if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && e.NState === 1) {

                                    var I = $(".templateList-center").index(el);
                                    $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/GT.png\" ></div>");
                                    $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                }
                                else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && e.NState === 2) {

                                    var I = $(".templateList-center").index(el);
                                    $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/CW.png\" ></div>");
                                    $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                }
                                else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && e.NState === -1) {

                                    var I = $(".templateList-center").index(el);
                                    $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/GT.png\" ></div>");
                                    $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                }
                                else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && e.NState === -2) {

                                    var I = $(".templateList-center").index(el);
                                    $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/CW.png\" ></div>");
                                    $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");

                                }
                                $(valueList).each(function (ind, elm) {
                                    if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && el.innerText.toLowerCase() === elm.Tag.toLowerCase() && e.NState === -1 && elm.xx === true) {
                                        var I = $(".templateList-center").index(el);
                                        $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/GT.png\" ></div>");
                                        $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                        var Name = e.Tag;
                                        alert(Name + "已经低于下限值")


                                    }
                                    else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && el.innerText.toLowerCase() === elm.Tag.toLowerCase() && e.NState === 1 && elm.sx === true) {

                                        var I = $(".templateList-center").index(el);
                                        $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/GT.png\" ></div>");
                                        $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                        var Name = e.Tag;
                                        alert(Name + "已经高于上限值")

                                    }
                                    else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && el.innerText.toLowerCase() === elm.Tag.toLowerCase() && e.NState === 2 && elm.zd === true) {

                                        var I = $(".templateList-center").index(el);
                                        $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/CW.png\" ></div>");
                                        $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                        var Name = e.Tag;
                                        alert(Name + "已经超过最高值")
                                    }
                                    else if (e.Tag.toLowerCase() === el.innerText.toLowerCase() && el.innerText.toLowerCase() === elm.Tag.toLowerCase() && e.NState === -2 && elm.zx === true) {

                                        var I = $(".templateList-center").index(el);
                                        $(leftList[I]).html("<div class=\"templateList-left fl\"><img src=\"icon/CW.png\" ></div>");
                                        $("#BJSY").html("<object height=\"1\" width=\"1\" classid=\"clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\"><param id=\"DisplayURL\" name=\"FileName\" value=\"audio/BJ.mp3\" /></object>");
                                        var Name = e.Tag;
                                        alert(Name + "已经低于最低值")


                                    }
                                })
                            })
                        });
                    }
                });
            }, DcTime);
        }
    }
}


//监控最大值最小值
$("#Monitor").click(function () {
    var reg = /^[0-9]+.?[0-9]*$/;
    var value = document.getElementById("value").value;
    var max = document.getElementById("max").value;
    var min = document.getElementById("min").value;
    var sx = document.getElementById("szMax").value;
    var xx = document.getElementById("szMin").value;
    var TcSj = document.getElementById("TcSj").value;

    if (TcSj && reg.test(TcSj)) {
        localStorage.setItem("time", TcSj);
    }
    else if (TcSj && !reg.test(TcSj)) {
        alert("定时监控只能输入数字，否则按默认时间监控")
    }

    if (!reg.test(max) || !reg.test(min) || !reg.test(sx) || !reg.test(xx)) {

        alert("最大值，最小值，上限值，下限值，只能输入数字")

    }
    else {
        var zd = $("#ZD").is(":checked");
        var zx = $("#ZX").is(":checked");
        var s = $("#SX").is(":checked");
        var x = $("#XX").is(":checked");
        var M = Number(max);
        var N = Number(min);
        var S = Number(sx);
        var X = Number(xx);
        if (M <= N) {
            alert("最小值大于最大值,请核对最小值和最大值")
        }
        else if (M <= S) {
            alert("上限值大于最大值,请核对上限值和最大值")
        }
        else if (M <= X) {
            alert("下限值大于最大值,请核对下限值和最大值")
        }
        else if (N >= S) {
            alert("最小值大于上限值,请核对最小值和上限值")
        }
        else if (N >= X) {
            alert("最小值大于下限值,请核对最小值和上限值")
        }
        else if (X >= S) {
            alert("下限值大于上限值,请核对下限值和上限值")
        }
        else {
            var utils = {
                setParam: function (name, value) {
                    localStorage.setItem(name, value)
                },
                getParam: function (name) {
                    return localStorage.getItem(name)
                }
            };
            var MaxMinValue =utils.getParam("MaxMinValue");
            if (MaxMinValue == null || MaxMinValue == "") {
                var jsonstr = {
                    "valueList": [{
                        Tag: value,
                        Max: max,
                        Min: min,
                        Limith: sx,
                        Limitl: xx,
                        zd: zd,
                        zx: zx,
                        sx: s,
                        xx: x,
                        TcSj: TcSj,
                        Monitor:true
                    }]
                };
                utils.setParam("MaxMinValue", "'" + JSON.stringify(jsonstr));
                $("#modal").hide("slow");
                $("#main").show("slow");
                window.location = "/"
            }
            else {
                var jsonstr = JSON.parse(MaxMinValue.substr(1, MaxMinValue.length));
                var valueList = jsonstr.valueList;
                var result = false;
                for (var i in valueList) {
                    if (valueList[i].Tag == value) {
                        alert("该点已经被监听");
                        result = true;
                    }
                }
                if (!result) {
                    valueList.push({
                        Tag: value,
                        Max: max,
                        Min: min,
                        Limith: sx,
                        Limitl: xx,
                        zd: zd,
                        zx: zx,
                        sx: s,
                        xx: x,
                        TcSj: TcSj,
                        Monitor:true
                    });
                }
                utils.setParam("MaxMinValue", "'" + JSON.stringify(jsonstr));
                $("#modal").hide("slow");
                $("#main").show("slow");
                window.location = "/"
            }
        }
    }

});


// 客户发送信息
$("#send").click(function () {
    var NowUserStates = localStorage.getItem("UserStates");
    var NowUserInfos = localStorage.getItem("userInfos");
    NowUserInfos = JSON.parse(NowUserInfos);
    var Time = function () {
        var date = new Date();
        var HG = '-';
        var MH = ":";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var days = date.getDate();
        var Hours = date.getHours();
        var Minutes = date.getMinutes();
        var Seconds = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (days >= 0 && days <= 9) {
            days = "0" + days;
        }
        if (Hours >= 1 && Hours <= 9) {
            Hours = "0" + Hours;
        }
        if (Minutes >= 1 && Minutes <= 9) {
            Minutes = "0" + Minutes;
        }
        if (Seconds >= 1 && Seconds <= 9) {
            Seconds = "0" + Seconds;
        }

        var NowDate = year + HG + month + HG + days + "," + Hours + MH + Minutes + MH + Seconds;
        return NowDate;
    };
    if (NowUserStates === null) {
        alert("登录才能发送信息")
    }
    else if (NowUserStates === "1") {
        var M = $("#txt").val();
        var t = Time();
        if (M.length > 0) {
            jQuery.ajax({
                type: 'POST',
                url: 'UserSay',
                data: {"userName": NowUserInfos.username, "Message": M, "time": t},
                contentType: "application/x-www-form-urlencoded",
                dataType: 'json',
                success: function (rusult) {
                    if (rusult === "1") {
                        alert("发送成功");
                        $("#txt").val("")
                    }
                }
            });
        }
        else {
            alert("发送不能为空")
        }
    }
    else if (NowUserStates === "2") {
        alert("管理员不可以留言")
    }
});


//需要进行前后台交互的区域结束


//查看单个监控点的详情

$(".templateList-center").live("click", function () {
    var index = $(".templateList-center").index(this);
    var b = document.getElementsByClassName("templateList-center")[index];
    var c = b.innerText;
    window.location = "/value.html?" + c
});


//查看全部监控点详情
$("#ShowAllMonitor").click(function () {
    var MaxMinValue = localStorage.getItem("MaxMinValue");
    if (MaxMinValue == null || MaxMinValue == "") {
        alert("检测您没有监控任何点")
    }
    else {
        window.location = "/allValue.html"
    }

});


//解除监控最大值最小值
$(".Relieve").live("click", function () {
    var r = confirm("是否解除改点监控");
    if (r === true) {
        var index = $(".Relieve").index(this);
        var MaxMinValue = localStorage.getItem("MaxMinValue");
        var jsonstrs = JSON.parse(MaxMinValue.substr(1, MaxMinValue.length));
        var valueLists = jsonstrs.valueList;
        valueLists.splice(index, 1);
        var jsonstr = {
            "valueList": valueLists
        };
        localStorage.setItem("MaxMinValue", "'" + JSON.stringify(jsonstr));
        var maxMinValue = localStorage.getItem("MaxMinValue");
        var jsonstrss = JSON.parse(maxMinValue.substr(1, maxMinValue.length));
        var valueListss = jsonstrss.valueList;
        if (valueListss.length === 0) {
            localStorage.removeItem("MaxMinValue");
            localStorage.removeItem("time");
        }
        window.location = "/"
    }
});

//是否开启和暂停点个点的监控
$(".right-img").live("click", function () {
    var index = $(".right-img").index(this);
    var MaxMinValue = localStorage.getItem("MaxMinValue");
    var jsonstrs = JSON.parse(MaxMinValue.substr(1, MaxMinValue.length));
    var valueLists = jsonstrs.valueList;
    var monitor = valueLists[index].Monitor;
    if (monitor) {
        var r = confirm("是否解暂停该点的监控");
        if (r === true) {
            valueLists[index]['Monitor'] = false;
            var jsonstr = {
                "valueList": valueLists
            };
            localStorage.setItem("MaxMinValue", "'" + JSON.stringify(jsonstr));
            window.location = "/"
        }
    }
    else {
        var c = confirm("是否解继续该点的监控");
        if (c === true) {
            valueLists[index]['Monitor'] = true;
            var jsonstr = {
                "valueList": valueLists
            };
            localStorage.setItem("MaxMinValue", "'" + JSON.stringify(jsonstr));
            window.location = "/"
        }
    }
});


//暂停全部监控
$("#stopDiv").click(function () {
    var MaxMinValue = localStorage.getItem("MaxMinValue");
    if (MaxMinValue == null || MaxMinValue == "") {
        alert("检查没有监控点,无需暂停")
    }
    else {
        var jsonstrs = JSON.parse(MaxMinValue.substr(1, MaxMinValue.length));
        var valueLists = jsonstrs.valueList;
        $(valueLists).each(function (i, e) {
            if (!e.Monitor) {
            }
            else {
                e['Monitor'] = false;
            }
        });
        alert("已暂停全部监控");
        var jsonstr = {
            "valueList": valueLists
        };
        localStorage.setItem("MaxMinValue", "'" + JSON.stringify(jsonstr));
        clearInterval(timer);
        window.location = "/"
    }
});


//继续全部监控
$("#startDiv").click(function () {
    var MaxMinValue = localStorage.getItem("MaxMinValue");
    if (MaxMinValue == null || MaxMinValue == "") {
        alert("检查没有监控点,无法开始监控")
    }
    else {
        var jsonstrs = JSON.parse(MaxMinValue.substr(1, MaxMinValue.length));
        var valueLists = jsonstrs.valueList;
        $(valueLists).each(function (i, e) {

                e['Monitor'] = true;
        });
        alert("已开始全部监控");
        var jsonstr = {
            "valueList": valueLists
        };
        localStorage.setItem("MaxMinValue", "'" + JSON.stringify(jsonstr));
        clearInterval(timer);
        window.location = "/"

    }

});




// 退出登陆
$("#outLogin").live("click", function () {
    localStorage.removeItem("UserStates");
    localStorage.removeItem("userInfos");
    window.location = "/"

});


// 查看留言板
$("#Message").live("click", function () {
    window.location = ("/MessageBoard.html?" + 1)
});


//左侧消失
$("#leftChange").click(function () {
    var left = $("#main-left");
    var center = $("#main-center");

    var L = document.getElementById("main-left");
    var R = document.getElementById("main-right");

    var H = window.screen.height;
    var W = window.screen.width;
    var F = W / H;
    if (F > 1.24 && F < 1.4) {
        if (L.style.display === "" && R.style.display === "") {
            left.hide("slow");
            center.css("width", "85%");

        }
        else if (L.style.display === "block" && R.style.display === "") {
            left.hide("slow");
            center.css("width", "85%");

        }
        else if (L.style.display === "none" && R.style.display === "") {
            left.show("slow");
            left.css({"overflow-y": "auto", "overflow-x": "auto"});
            center.css("width", "70%");


        }
        else if (L.style.display === "block" && R.style.display === "block") {
            left.hide("slow");
            center.css("width", "85%");

        }
        else if (L.style.display === "none" && R.style.display === "block") {
            left.show("slow");
            left.css({"overflow-y": "auto", "overflow-x": "auto"});
            center.css("width", "70%");

        }
        else if (L.style.display === "block" && R.style.display === "none") {
            left.hide("slow");
            center.css("width", "100%");


        }
        else if (L.style.display === "none" && R.style.display === "none") {
            left.show("slow");
            left.css({"overflow-y": "auto", "overflow-x": "auto"});
            center.css("width", "85%");

        }
        else if (L.style.display === "" && R.style.display === "block") {
            left.hide("slow");
            center.css("width", "85%");


        }
        else if (L.style.display === "" && R.style.display === "none") {
            left.hide("slow");
            center.css("width", "100%");

        }
    }
    else {
        if (L.style.display === "" && R.style.display === "") {
            left.hide("slow");
            center.css("width", "85%");
        }
        else if (L.style.display === "block" && R.style.display === "") {
            left.hide("slow");
            center.css("width", "85%");
        }
        else if (L.style.display === "none" && R.style.display === "") {
            left.show("slow");
            left.css({"overflow-y": "auto", "overflow-x": "auto"});
            center.css("width", "70%");
        }
        else if (L.style.display === "block" && R.style.display === "block") {
            left.hide("slow");
            center.css("width", "85%");
        }
        else if (L.style.display === "none" && R.style.display === "block") {
            left.show("slow");
            left.css({"overflow-y": "auto", "overflow-x": "auto"});
            center.css("width", "70%");
        }
        else if (L.style.display === "block" && R.style.display === "none") {
            left.hide("slow");
            center.css("width", "100%");

        }
        else if (L.style.display === "none" && R.style.display === "none") {
            left.show("slow");
            left.css({"overflow-y": "auto", "overflow-x": "auto"});
            center.css("width", "85%");
        }
        else if (L.style.display === "" && R.style.display === "block") {
            left.hide("slow");
            center.css("width", "85%");

        }
        else if (L.style.display === "" && R.style.display === "none") {
            left.hide("slow");
            center.css("width", "100%");
        }
    }


});

//右侧消失
$("#rightChange").click(function () {
    var right = $("#main-right");
    var center = $("#main-center");
    var L = document.getElementById("main-left");
    var R = document.getElementById("main-right");

    var H = window.screen.height;
    var W = window.screen.width;
    var F = W / H;
    if (F > 1.24 && F < 1.4) {
        if (L.style.display === "" && R.style.display === "") {
            right.hide("slow");
            center.css("width", "85%")

        }
        else if (L.style.display === "block" && R.style.display === "") {
            right.hide("slow");
            center.css("width", "85%");

        }
        else if (L.style.display === "none" && R.style.display === "") {
            right.hide("slow");
            center.css("width", "100%");

        }
        else if (L.style.display === "block" && R.style.display === "block") {
            right.hide("slow");
            center.css("width", "85%");

        }
        else if (L.style.display === "none" && R.style.display === "block") {
            right.hide("slow");
            center.css("width", "100%");

        }
        else if (L.style.display === "block" && R.style.display === "none") {
            right.show("slow");
            center.css("width", "70%");

        }
        else if (L.style.display === "none" && R.style.display === "none") {
            right.show("slow");
            center.css("width", "85%");

        }
        else if (L.style.display === "" && R.style.display === "block") {
            right.hide("slow");
            center.css("width", "85%");

        }
        else if (L.style.display === "" && R.style.display === "none") {
            right.show("slow");
            center.css("width", "70%");

        }

    }
    else {
        if (L.style.display === "" && R.style.display === "") {
            right.hide("slow");
            center.css("width", "85%")
        }
        else if (L.style.display === "block" && R.style.display === "") {
            right.hide("slow");
            center.css("width", "85%");

        }
        else if (L.style.display === "none" && R.style.display === "") {
            right.hide("slow");
            center.css("width", "100%");
        }
        else if (L.style.display === "block" && R.style.display === "block") {
            right.hide("slow");
            center.css("width", "85%");
        }
        else if (L.style.display === "none" && R.style.display === "block") {
            right.hide("slow");
            center.css("width", "100%");
        }
        else if (L.style.display === "block" && R.style.display === "none") {
            right.show("slow");
            center.css("width", "70%");
        }
        else if (L.style.display === "none" && R.style.display === "none") {
            right.show("slow");
            center.css("width", "85%");
        }
        else if (L.style.display === "" && R.style.display === "block") {
            right.hide("slow");
            center.css("width", "85%");
        }
        else if (L.style.display === "" && R.style.display === "none") {
            right.show("slow");
            center.css("width", "70%");

        }
    }


});

//点击缩小
$("#narrow").click(function () {
    var b = $("#SBei").text();
    if (b > 1) {
        b--;
        $("#SBei").text(b);
        $("#FBei").text(b);
        var size = 100 * (1 + 0.2 * b);
        $("#iframe").css("height", size + "%");
        $("#iframe").css("width", size + "%");
        $("#Pbd1").css("height", size + "%");
        $("#Pbd1").css("width", size + "%");
    }
    else if (b = 1) {
        $("#iframe").css("height", 100 + "%");
        $("#iframe").css("width", 100 + "%");
        $("#Pbd1").css("height", 100 + "%");
        $("#Pbd1").css("width", 100 + "%");
    }
});

//点击放大
$("#enlarge").click(function () {
    var a = $("#FBei").text();
    if (a < 5) {
        a++;
        $("#FBei").text(a);
        $("#SBei").text(a);
        var b = $("#FBei").text();
        var size = 100 * (1 + 0.2 * b);
        $("#iframe").css("height", size + "%");
        $("#iframe").css("width", size + "%");
        $("#Pbd1").css("height", size + "%");
        $("#Pbd1").css("width", size + "%");
    }
});

//鼠标滑动放大和缩小
$("#main-center").mouseenter(function () {
    //滚动事件
    var scrollFunc = function (e) {
        e = e || window.event;
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                fd()
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
                sx()
            }
        }
        else if (e.detail) {  //Firefox滑轮事件
            if (e.detail > 0) { //当滑轮向上滚动时
                fd()
            }
            if (e.detail < 0) { //当滑轮向下滚动时
                sx()
            }
        }
    };

    //放大
    function fd() {
        var a = $("#FBei").text();
        if (a < 5) {
            a++;
            $("#FBei").text(a);
            $("#SBei").text(a);
            var b = $("#FBei").text();
            var size = 100 * (1 + 0.2 * b);
            $("#iframe").css("height", size + "%");
            $("#iframe").css("width", size + "%");
            $("#Pbd1").css("height", size + "%");
            $("#Pbd1").css("width", size + "%");
        }
    }

    //缩小
    function sx() {
        var b = $("#SBei").text();
        if (b > 1) {
            b--;
            $("#SBei").text(b);
            $("#FBei").text(b);
            var size = 100 * (1 + 0.2 * b);
            $("#iframe").css("height", size + "%");
            $("#iframe").css("width", size + "%");
            $("#Pbd1").css("height", size + "%");
            $("#Pbd1").css("width", size + "%");
        }
        else if (b = 1) {
            $("#iframe").css("height", 100 + "%");
            $("#iframe").css("width", 100 + "%");
            $("#Pbd1").css("height", 100 + "%");
            $("#Pbd1").css("width", 100 + "%");
        }

    }

    //给页面绑定滑轮滚动事件
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
    //滚动滑轮触发scrollFunc方法
    window.onmousewheel = document.onmousewheel = scrollFunc;

});


//鼠标移除禁止滑动放大和缩小
$("#main-center").mouseleave(function () {

    disabledMouseWheel();

    function disabledMouseWheel() {
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', scrollFunc, false);
        }//W3C
        window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome
    }

    function scrollFunc(evt) {
        evt = evt || window.event;
        if (evt.preventDefault) {
            // Firefox
            evt.preventDefault();
            evt.stopPropagation();
        } else {
            // IE
            evt.cancelBubble = true;
            evt.returnValue = false;
        }
        return false;
    }

});







//显示弹窗
$("#ShowMonitor").click(function () {
    $("#main").hide("slow");
    $("#modal").show("slow");
});


//关闭弹窗
$("#modal-GB").click(function () {
    $("#modal").hide("slow");
    $("#main").show("slow");
});

/*

//F11全屏显示
$(document).keydown(function (event) {
    if (event.keyCode === 122) {
        window.location="/";
        var w = window.screen.availHeight;
        var left = document.getElementById("main-left");
        var center = document.getElementById("main-center");
        var right = document.getElementById("main-right");
        left.style.height = (w - 60) + "px";
        center.style.height = (w - 60) + "px";
        right.style.height = (w - 60) + "px";
    }
});


//监控退出全屏
window.onresize = function () {
    if (!checkFull()) {
      window.location="/"
    }
};

function checkFull() {
    var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
    if (isFull === undefined) isFull = false;
    return isFull;
}
*/

