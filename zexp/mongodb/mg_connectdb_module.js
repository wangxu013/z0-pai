//连接上mongodb
//了解什么是useNewUrlParser: true, useUnifiedTopology: true
//引入mongoose

const path = require('path');
const mongoose = require('mongoose');
var db_url = 'mongodb://127.0.0.1:27017/sakura';
// console.log(path.join(__dirname, 'public'));

//连接数据库

mongoose.connect(db_url);

//连接成功

mongoose.connection.on('connected',function(){
    console.log('Mongoose connection open to ' + db_url);
});

//连接失败

mongoose.connection.on('error',function(err){
    console.log('Mongoose connection error: ' + err);
});

//连接断开

mongoose.connection.on('disconnected',function(){
    console.log('Mongoose connection disconnected');
});

//当程序退出时，关闭连接

process.on('SIGINT',function(){
    mongoose.connection.close().then(()=>{
        console.log('Mongoose connection disconnected through app termination');
        process.exit(0);
    }).catch(()=>{
        console.log(err);
        process.exit(1);

    });
});

//导出mongoose
// console.log(mongoose);
module.exports = mongoose;


