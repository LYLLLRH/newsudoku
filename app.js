'use strict'

var express = require('express');
var app = express();
var path = require('path');
var WEBPORT = 3000;
var fs = require('fs');
// console.log(path.join(__dirname,'public'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/',function (req,res) {
	var opts = {
		root: __dirname
	};
	res.sendFile('./index.html',opts);
})

app.listen(WEBPORT,function () {
	console.log("Server Running on port:"+WEBPORT);
});
