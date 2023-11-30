/*
 *从系统中获取server外部ip, 端口号, 网络protocol
 *写入public文件夹下的serverNetAddress文件,即回访"外部网络地址"
 */


//引入https模块
const https = require('https');

//获取公共ip
async function getPublicIp() {
  
return await new Promise((resolve, reject) => {
  https.get('https://api.ipify.org', (res) => {
    res.on('data', (chunk) => {
      // console.log(`Your public IP address is: ${chunk}`);
      let serverIp = chunk;
      resolve(serverIp);
    });
  }).on('error', (err) => {
    console.error(`Error: ${err.message}`);
    reject(err);
  });
}) 
};



//获取网络协议
const protocol = process.env.PROTOCOL || 'http';


/*
 *update 客服端public文件夹下的serverNetAddress文件,即回访"外部网络地址"
 */
const fs = require('fs');
const path = require('path');

let serverNetAddress;


//设置写文件writeIpAddress()

async function updateServerNetAddress(serverPort) {
  // 指定你要修改的文件的路径
  let filePath = path.join(__dirname, '../public/javascripts/assets', 'serverNetAddress.js');

  let serverIp = await getPublicIp();
 
  //拼接为外部网络地址

  serverNetAddress = `${protocol}://${serverIp}:${serverPort}`;

  
//!测试用
  // serverNetAddress = 'http://127.0.0.1:8000';


  //定义文件内容
  let data = `var serverNetAddress ='${serverNetAddress}';
var serverIp = '${serverIp}';
var serverPort ='${serverPort}';
var serverProtocol ='${protocol}';`



  try {
    // 打开文件
    fs.openSync(filePath, 'w');
  } catch (err) {
    console.log(err, ' 打开serverNetAddress文件错误');
  }

  try {
    // 写入文件
    fs.writeFileSync(filePath, data, 'utf8');
  } catch (err) {
    console.log(err);
    console.log('写入serverNetAddress文件错误');
  }
  console.log('写入public/serverNetAddress.js信息:'+data);

};

//导出writeIPAddress
module.exports = {
  updateServerNetAddress,
  serverNetAddress

};
