var express = require("express");                         //引入express框架
var IndexRouter = require('./controller/IndexRouter');    //引入客户路由
var session = require("express-session");                //引入session模块


var app = express();                                   //实例化express


//引入中间件
app.use(session({                                     //使用session中间件
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


app.use(express.static("./public"));                             //静态PUBLIC


//公共部分（客户端）
app.post("/userLogin", IndexRouter.userLogin);                    //用户登录

app.post("/admUserLogin", IndexRouter.admUserLogin);             //管理员用户登录

app.post("/HomeLeftNav", IndexRouter.YWHomeLeftNav);            //请求左侧导航

app.post("/getObjectData", IndexRouter.getObjectData);           //动态请求Object

app.post("/UserSay", IndexRouter.UserSay);                      //客户发送的信息

app.post("/userRegister", IndexRouter.userRegister);             //用户注册

app.post("/admRegister", IndexRouter.admRegister);               //管理员用户注册

app.post("/getMessageList", IndexRouter.getMessageList);         //动态获取留言详情

app.post("/deleteMessage", IndexRouter.deleteMessage);           //动态获取留言详情


app.post("/downloadList", IndexRouter.downloadList);              //获取下载列表

app.listen(3006);                                                 //监听3000端口

console.log("SERVER START");                                     //控制台打印服务器成功启动信息
