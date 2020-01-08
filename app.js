var http = require("http");
var fs = require("fs"); //文件系统的模块
var server = http.createServer();
var url = require("url")

var mongodb = require("mongodb")
var MongoClient = mongodb.MongoClient;

var usedusername = new Array("zhangsan", "lisi")
server.on("request", function(req, res) {
	/* 	console.log(req.method);
		//请求的方式
		console.log(req.url);
		//请求的地址  */
	var pathname = url.parse(req.url, true).pathname; //获取地址
	var query = url.parse(req.url, true).query; //获取参数
	var username = query.username;
	var userpwd = query.userpwd;
	var userphone = query.userphone;

	//数据库
	var database_url = "mongodb://localhost:27017/";
	var database_name = "OnePlus";
	var base_url = database_url + database_name;

	console.log(pathname, query.username)

	if (req.url == "/zhuce.html" && req.method == "GET") {
		fs.readFile("./zhuce.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (req.url == "/login.html" && req.method == "GET") {
		fs.readFile("./login.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (pathname == "/addData" && req.method == "GET") { 		//测试:连接数据库
		MongoClient.connect(base_url, function(err, db) {
			console.log("数据库连接成功!!")
			db.collection('OnePlus').insertOne({ 						//测试:增加操作
				"name": "mmm",
				"age": 111
			}, function(err, result) {
				res.end("add is OK !")
				db.close()
			})
		})
	} else if (pathname == "/findData" && req.method == "GET") { 			//测试:查询数据库数据
		MongoClient.connect(base_url, function(err, db) {
			db.collection('emp').find({}).toArray(function(err, result) {   //返回集合中的所有数据
				console.log(result)
				res.writeHead(200, {
					"Content-type": "text/json;charset=utf8"
				})
				res.end(JSON.stringify(result))
				db.close()
			})
		})
	}else if(pathname == "/CheckUsername" && req.method == "GET"){//注册:用户名选框失焦:判断该用户名是否已被注册(已在数据库中)
		console.log("注册页面用户名选框失焦-接收到用户名:" + username);
		MongoClient.connect(base_url, function(err, db) {
			db.collection('OnePlus').find({}).toArray(function(err, result) { //返回集合中的所有数据
				//规则 0-已经被注册了  1-可以用
				for (var i = 0; i < result.length; i++) {
					if (username == result[i].username) {
						res.end("0")
						break;
					}
				}
				res.end("1")
				db.close()
			})
		})
	}
	else if(pathname == "/CheckZhuCe" && req.method == "GET"){			// 注册:把用户名/密码/手机号写入数据库
		console.log("注册页面-接收到用户名:" + username);
		console.log("注册页面-接收到密码:" + userpwd);
		console.log("注册页面-接收到手机号:" + userphone);
		var canWriterData = true; //是否能把注册信息写入数据库
		MongoClient.connect(base_url, function(err, db) {
			db.collection('OnePlus').find({}).toArray(function(err, result) { //返回集合中的所有数据
				//规则 0-写入失败  1-写入成功
				for (var i = 0; i < result.length; i++) {        //查询用户名是否唯一,密码是否符合正则表达式,手机号是否规范todo……
					if (username == result[i].username) {
						canWriterData = false;
						console.log("canWriterData:"+canWriterData)
						break;
					}
				}
				console.log("canWriterData:"+canWriterData)
				if(canWriterData == true){	
					res.end("1")
					MongoClient.connect(base_url, function(err, db) {		//写入数据库
						console.log("写入数据库!!")
						db.collection('OnePlus').insertOne({ 						//测试:增加操作
							"username": username,
							"userpwd": userpwd,
							"userphone": userphone,
							"logined":  1                //是否已登录    0-已登录  1-未登录
						}, function(err, result) {
							//db.close()
						})
					})
				}else	
					res.end("0");
				
				db.close()
			})
		})
	}else if(pathname == "/CheckLogined" && req.method == "GET"){ 		//判断是否被占用(已经在登录中)
		MongoClient.connect(base_url, function(err, db) {
			db.collection('OnePlus').find({}).toArray(function(err, result) { //返回集合中的所有数据
				//规则 0-用户名密码正确  1-用户名或密码错误
				for (var i = 0; i < result.length; i++) {
					if (username == result[i].username) {
						if(result[i].logined == 0)		//被占用
						{
							res.end("0")
							break;
						}
					}
				}
				res.end("1")
				db.close()
			})
		})
	}
	else if (pathname == "/CheckLogin" && req.method == "GET") { 		//验证登录
		console.log("登录页面-接受到用户名:" + username);
		console.log("登录页面-接受到密码:" + userpwd);
		MongoClient.connect(base_url, function(err, db) {
			db.collection('OnePlus').find({}).toArray(function(err, result) { //返回集合中的所有数据
				/* console.log(result)
				res.writeHead(200, {
					"Content-type": "text/json;charset=utf8"
				})
				res.end(JSON.stringify(result)) */
				//规则 0-用户名密码正确  1-用户名或密码错误
				for (var i = 0; i < result.length; i++) {
					if (username == result[i].username && userpwd == result[i].userpwd &&  result[i].logined != 0) {
						res.end("0")
						break;
					}
				}
				res.end("1")
				db.close()
			})
		})
	}
});
server.listen(3001);
