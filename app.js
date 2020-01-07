var http = require("http");
var fs = require("fs"); //文件系统的模块
var server = http.createServer();
server.on("request", function(req, res) 
{
	console.log(req.method);
	//请求的方式
	console.log(req.url);
	//请求的地址  
			if (req.url == "/page/index.html" && req.method == "GET") 
			{ 
				fs.readFile("./page/index.html", "utf8", function(err, data) {
					res.end(data);
				});
			} else if (req.url == "/page/login.html" && req.method == "GET") 
			{ 
				fs.readFile("./page/login.html", "utf8", function(err, data) {
					res.end(data);
				});
			}else if(req.url == "/getData" && req.method == "GET"){
				console.log('已经拿到数据')
				res.end('拿到了app中数据');
			}
			 else 
			{
				fs.readFile("./page/404.html", "utf8", function(err, data) {
					res.end(data);
				});
			}
}); 
server.listen(3001);
