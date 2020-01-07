var http = require("http");
var fs = require("fs"); //文件系统的模块
var server = http.createServer();
var url = require("url")

var data = [{
		name: "admin",
		pwd: "admin"
	},
	{
		name: "zhangsan",
		pwd: "123456"
	},
	{
		name: "lisi",
		pwd: "123456"
	}
]
var usedusername = new Array("zhangsan","lisi")
server.on("request", function(req, res) {
	/* 	console.log(req.method);
		//请求的方式
		console.log(req.url);
		//请求的地址  */
	var pathname = url.parse(req.url, true).pathname; //获取地址
	var query = url.parse(req.url, true).query; //获取参数
	var username = query.username;
	var userpwd = query.userpwd;

	console.log(pathname, query.username)

	if (req.url == "/index.html" && req.method == "GET") {
		fs.readFile("./index.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (req.url == "/login.html" && req.method == "GET") {
		fs.readFile("./login.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (pathname == "/regusername" && req.method == "GET") { //判断该用户名是否被占用  1-未占用 0-被占用
			for (var i = 0; i < usedusername.length; i++) {
				if (username == usedusername[i]) {
					res.end("0")
					break;
				}
			}
			res.end("1")
	} else if (pathname == "/regusernameAndpwd" && req.method == "GET") { //验证用户名密码
		console.log("接受到用户名:" + username);
		console.log("接受到密码:" + userpwd);

		//规则 0-用户名密码正确  1-用户名或密码错误 
		for (var i = 0; i < data.length; i++) {
			if (username == data[i].name && userpwd == data[i].pwd) {
				res.end("0")
				break;
			}
		}
		res.end("1")
	}
});
server.listen(3001);
