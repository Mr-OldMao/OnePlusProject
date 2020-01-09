var http = require("http");
var fs = require("fs"); //文件系统的模块
var server = http.createServer();
var url = require("url")

var mongodb = require("mongodb")
var MongoClient = mongodb.MongoClient;

var usedusername = new Array("zhangsan", "lisi")

//
var clickProId = "" //点击到的商品
var shopcarSid = 2 //商品号id
var tempSid = "s" + shopcarSid


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

	//商品
	var pro_pname = query.pname;
	var pro_pprice = query.pprice;
	var pro_scount = query.scount;
	var pro_sprice = query.sprice;
	//Shopcar给的sid
	var pro_sid = query.shopcar_sid;
	

	// console.log(pathname, query.username)

	if (req.url == "/zhuce.html" && req.method == "GET") {
		fs.readFile("./zhuce.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (req.url == "/login.html" && req.method == "GET") {
		fs.readFile("./login.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (pathname == "/addData" && req.method == "GET") { //测试:连接数据库
		MongoClient.connect(base_url, function(err, db) {
			console.log("数据库连接成功!!")
			db.collection('OnePlus').insertOne({ //测试:增加操作
				"name": "mmm",
				"age": 111
			}, function(err, result) {
				res.end("add is OK !")
				db.close()
			})
		})
	} else if (pathname == "/findData" && req.method == "GET") { //测试:查询数据库数据
		MongoClient.connect(base_url, function(err, db) {
			db.collection('emp').find({}).toArray(function(err, result) { //返回集合中的所有数据
				console.log(result)
				res.writeHead(200, {
					"Content-type": "text/json;charset=utf8"
				})
				res.end(JSON.stringify(result))
				db.close()
			})
		})
	} else if (pathname == "/CheckUsername" && req.method == "GET") { //注册:用户名选框失焦:判断该用户名是否已被注册(已在数据库中)
		console.log("注册页面用户名选框失焦-接收到用户名:" + username);
		MongoClient.connect(base_url, function(err, db) {
			db.collection('User').find({}).toArray(function(err, result) { //返回集合中的所有数据
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
	} else if (pathname == "/CheckZhuCe" && req.method == "GET") { // 注册:把用户名/密码/手机号写入数据库
		console.log("注册页面-接收到用户名:" + username);
		console.log("注册页面-接收到密码:" + userpwd);
		console.log("注册页面-接收到手机号:" + userphone);
		var canWriterData = true; //是否能把注册信息写入数据库
		MongoClient.connect(base_url, function(err, db) {
			db.collection('User').find({}).toArray(function(err, result) { //返回集合中的所有数据
				//规则 0-写入失败  1-写入成功
				for (var i = 0; i < result.length; i++) { //查询用户名是否唯一,密码是否符合正则表达式,手机号是否规范todo……
					if (username == result[i].username) {
						canWriterData = false;
						console.log("canWriterData:" + canWriterData)
						break;
					}
				}
				console.log("canWriterData:" + canWriterData)
				if (canWriterData == true) {
					res.end("1")
					MongoClient.connect(base_url, function(err, db) { //写入数据库
						console.log("写入数据库!!")
						db.collection('User').insertOne({ //测试:增加操作
							"username": username,
							"userpwd": userpwd,
							"userphone": userphone,
							"logined": 1 //是否已登录    0-已登录  1-未登录
						}, function(err, result) {
							//db.close()
						})
					})
				} else
					res.end("0");
				db.close()
			})
		})
	} else if (pathname == "/CheckLogined" && req.method == "GET") { //判断是否被占用(已经在登录中)
		MongoClient.connect(base_url, function(err, db) {
			db.collection('User').find({}).toArray(function(err, result) { //返回集合中的所有数据
				//规则 0-用户名密码正确  1-用户名或密码错误
				for (var i = 0; i < result.length; i++) {
					if (username == result[i].username) {
						if (result[i].logined == 0) //被占用
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
	} else if (pathname == "/CheckLogin" && req.method == "GET") { //验证登录
		console.log("登录页面-接受到用户名:" + username);
		console.log("登录页面-接受到密码:" + userpwd);
		MongoClient.connect(base_url, function(err, db) {
			db.collection('User').find({}).toArray(function(err, result) { //返回集合中的所有数据
				/* console.log(result)
				res.writeHead(200, {
					"Content-type": "text/json;charset=utf8"
				})
				res.end(JSON.stringify(result)) */
				//规则 0-用户名密码正确  1-用户名或密码错误
				for (var i = 0; i < result.length; i++) {
					if (username == result[i].username && userpwd == result[i].userpwd && result[i].logined != 0) {
						res.end("0")
						break;
					}
				}
				res.end("1")
				db.close()
			})
		})
	}



	//商城页面:/store.html    商城->商品详情 接口:/store
	//逻辑:商城->点击某个商品 传递商品的pid ->商品详细信息
	//版本型号pvision,商品库存数量pcount
	else if (req.url == "/store.html" && req.method == "GET") {
		fs.readFile("./store.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (pathname == "/store" && req.method == "GET") {
		var shangping1 = query.shangping1;
		console.log("商城页面 点击了商品:" + shangping1);
		MongoClient.connect(base_url, function(err, db) {
			db.collection('Product').find({}).toArray(function(err, result) { //返回集合中的所有数据
				for (var i = 0; i < result.length; i++) {
					if (shangping1 == result[i].pid) {
						res.end(result[i].pid)
						clickProId = result[i].pid
						console.log("找到了商品~~~~~~ clickProId:" + clickProId);
						break;
					}
				}
				res.end("-1") //未找到了商品
				db.close()
			})
		})
	}


	//商品详情/productDetail.html   商品详情->购物车 接口: /productDetail
	//接收数据: 商城页面:/store.html 中点击发送的pid页面 拿到后找到商品图片pimg等信息用于显示
	//逻辑:商品详情->点击立即购买跳转至购物车页面 传递 Shopcar表中的 pid号
	else if (req.url == "/productDetail.html" && req.method == "GET") {
		fs.readFile("./productDetail.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (pathname == "/productDetail" && req.method == "GET") {
		MongoClient.connect(base_url, function(err, db) {
			db.collection('Product').find({}).toArray(function(err, result) { //返回集合中的所有数据
				for (var i = 0; i < result.length; i++) {
					console.log("clickProId:" + clickProId + ",result[i].pid=" + result[i].pid);
					if (clickProId == result[i].pid) {
						var mycars = {
							pname: result[i].pname,
							pprice: result[i].pprice,
							pimg: result[i].pimg,
							pvision: result[i].pvision,
							pcount: result[i].pcount
						}
						console.log(mycars)
						res.end(JSON.stringify(mycars))
						console.log("商品详情~~~~~~");
						break;
					}
				}
				res.end("-1") //未找到了商品 
				db.close()
			})
		})
	}

	//购物车/Shopcar.html   购物车->订单结算 接口: /Shopcar
	//接收数据: 上一个页面商品详情/productDetail.html中的 pid数据 -> 显示 商品名 单价 等信息
	//逻辑:->继续购物跳转至商城页面:/store.html,去结算->跳转至订单结算/Order.html   传递sid号
	else if (req.url == "/Shopcar.html" && req.method == "GET") {
		fs.readFile("./Shopcar.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (pathname == "/Shopcar" && req.method == "GET") {  //接收/ProductDetail的数据
		
		shopcarSid++;
		var insertData = {
			Sid: tempSid,
			pname: pro_pname,
			pprice: pro_pprice,
			scount: pro_scount,
			sprice: pro_sprice
		}
		MongoClient.connect(base_url, function(err, db) {
			console.log(insertData)
			db.collection('Shopcar').insertOne(insertData,
				function(err, result) {
					res.end("add is OK !")
					//res.end(JSON.stringify(insertData))
					db.close()
				})
		})
	}
	//给购物车/Shopcar发送数据
	else if(pathname == "/ShopcarEnd" && req.method == "GET"){
		MongoClient.connect(base_url, function(err, db) {
			db.collection('Shopcar').find({}).toArray(function(err, result) { //返回集合中的所有数据
				for (var i = 0; i < result.length; i++) {
					if (tempSid == result[i].Sid) {
						var mycars = {
							Sid: result[i].Sid,
							pname: result[i].pname,
							pprice: result[i].pprice,
							scount: result[i].scount,
							sprice: result[i].sprice
						}
						//console.log(mycars)
						res.end(JSON.stringify(mycars))
						break;
					}
				}
				res.end("-1") //未找到了商品 
				db.close()
			})
		})
	}

	//订单结算/Order.html    接口: /Order
	//接收数据: 购物车页面/Order.html中的sid号 用于显示商品名 等信息
	else if (req.url == "/Order.html" && req.method == "GET") {
		fs.readFile("./Order.html", "utf8", function(err, data) {
			res.end(data);
		});
	} else if (pathname == "/Order" && req.method == "GET") {		//发送数据给/Order
		MongoClient.connect(base_url, function(err, db) {
			db.collection('Shopcar').find({}).toArray(function(err, result) { //返回集合中的所有数据
				for (var i = 0; i < result.length; i++) {
					if (pro_sid == result[i].Sid) {
						var mycars = {
							Sid: result[i].Sid,
							pname: result[i].pname,
							pprice: result[i].pprice,
							scount: result[i].scount,
							sprice: result[i].sprice
						}
						console.log(mycars)
						res.end(JSON.stringify(mycars))
						console.log("拿到最终数据")
						break;
					}
				}
				res.end("-1") //未找到了商品 
				db.close()
			})
		})
	}
	else if (pathname == "/OrderEnd" && req.method == "GET") {  //接收Order数据
		
	}

});
server.listen(3001);
