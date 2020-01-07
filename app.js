var http = require("http");
var fs = require("fs"); //文件系统的模块
var server = http.createServer();
var url = require("url")

server.on("request", function(req, res) {
	/* 	console.log(req.method);
		//请求的方式
		console.log(req.url);
		//请求的地址  */


	var pathname = url.parse(req.url, true).pathname; //获取地址
	var query = url.parse(req.url, true).query; //获取参数
	console.log(pathname, query.username)

	if (req.url == "/index.html" && req.method == "GET") {
		fs.readFile("./index.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (req.url == "/login.html" && req.method == "GET") {
		fs.readFile("./login.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (pathname == "/regusername" && req.method == "GET") {
		var username = query.username;
		console.log(username);
		if (username == "zhangsan") {
			res.end("0")
		} else {
			res.end("1")
		}
	}
});
server.listen(3001);
