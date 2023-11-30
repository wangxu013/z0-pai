var express = require('express');
var router = express.Router();
const path = require('path');
let url1 = path.join(__dirname, '../assets/js/dateTrans_module');
let url2 = path.join(__dirname, '../mongodb/mg_model_module');

//引入日期转化模块
const dateTrans = require(url1);
//引入数据库操作文件
const WorkSchedule = require(url2).WorkSchedule;


//引入请求体分析中间件

router.use(express.urlencoded({
  extended: false
}));
router.use(express.json());




//!----------------------------------------------------------------------------------

//**GET dragTable page. 响应dragTable.html页面
router.get('/', function (req, res, next) {
  // res.render("dragTable-copy.ejs");
  res.render('dragTable.ejs');
}); // ! |||||||||||end响应dragTable.html页面|||||||||||||||||||||||||||||||||

//*response fetch, from /getemployeedb 即dragblock
router.all('/getemployeedb', function (req, res, next) {
  //?响应头允许跨域
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With,application/json");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", 'Express');

  console.log("进入/getemployeedb");

  //?get data from mongodb/employee
  //!require Employee module
  let Employee = require('../mongodb/mg_model_module').Employee;

  //!set async getemployeedb()
  async function getemployeedb() {
    //get data from mongodb/employee
    ep_db = await Employee.find({
      $or: [{
        status: "onJob"
      }, {
        status: "partTime"
      }]
    }, {
      _id: 0,
      number: 1,
      name: 1,
      status: 1,
      posNumber:1
    }).lean().sort({
      status: 1,
      posNumber: 1,
      number: 1
    }).catch(err => {
      console.log("Employee读取:", err);
    });
    // console.log(ep_db);
    //将数据返回给前端
    res.json(ep_db);
    res.end();

  }

  //!执行
  getemployeedb();
}) // ! |||||||||||end |||||response fetch, from /getemployeedb|||||||||||||

//* response fetch, from submit btn
router.all('/submit', function (req, res, next) {
  //?响应头允许跨域
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With,application/json");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", 'Express');

  //?处理请求,提交并存储数据
  //!获取请求数据
  let workSchedules = req.body;
  // console.log(workSchedules);
  //将数据存入mongodb
  //判断workSchedules中所有数据的字段的时间 1.是否在本周周一之前 2.日期是否不在同一周内
  //!如果是，则返回错误信息
  let isErr = false;
  let timestampArr = [];
  for (let schedule of workSchedules) {
    let date = schedule.workdate;
    let thisMonday = new Date(dateTrans.getMonDate(new Date().toLocaleDateString()));
    let timestamp = Date.parse(date);

    //比较时间
    if (Date.parse(date) < Date.parse(thisMonday)) {
      res.json('workSchedules上传失败,日期存在本周之前');
      res.end();
      isErr = true;
      break;
    };
    timestampArr.push(timestamp);
    //判断最大的时间戳和最小的时间戳是否在同一周
    let maxTimestamp = Math.max(...timestampArr);
    let minTimestamp = Math.min(...timestampArr);
    if (!dateTrans.isSameWeek(maxTimestamp, minTimestamp)) {
      res.json('workSchedules上传失败,日期存在跨周');
      res.end();
      isErr = true;
      break;
    };
  };

  //!如果不是，则存入mongodb
  if (!isErr) {
    //删除workSchedule中日期所在周的所有数据
    let sevenworkday = dateTrans.getWeekDate(workSchedules[0].workdate);
    //删除七天整个周的数据
    async function deleteData() {
      let delnum = await WorkSchedule.deleteMany({
        workdate: {
          $in: sevenworkday
        }
      }).catch(err => console.log(err));
      // console.log(delnum);
    }

    //将新的数据存入workSchedule
    async function insert() {
      let result = await WorkSchedule.create(workSchedules).catch(err => console.log(err));
      // console.log(result);
    }
    //执行操作
    async function operate() {
      await deleteData();
      await insert();
    }

    operate();

    //返回成功
    res.json('workSchedules上传,并修改成功');
    res.end();
  };
}); // ! |||||||||end||||||submit btn|||||||||||||||||||||||||||||||||||||||

//* response fetch, from page table data onload
router.all('/tabledata', function (req, res, next) {
  //?res header setting
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", 'Express');

  //?按照请求的日期,响应该整个周的 "表格填充蓝图"
  //!获取数据
  dateReq = dateTrans.dateformat(req.query.date);
  if (dateReq) {
    // console.log("收到tabledata请求,from管理班表页面",dateReq);
  } else {
    console.log("dateReq is undefined");
    res.json('dateReq is undefined');
    res.end();
    return;
  }


  //!设置操作:获取某个整周的"表格填充蓝图"
  //获取指定日期的"整周日期数据"
  let dates = dateTrans.getWeekDate(dateReq);

  /*设置操作:获取某个整周的"表格填充蓝图"
    1.获取指定日期的db数据
    2.整理db数据为[{ idnum: '2301', pos: 'busser', time: 'sat_am' },{...}]
    3.返回结果
  */

  async function getData(dates) {
    let db = await WorkSchedule.find({
      workdate: {
        $in: dates
      }
    }).select('position workdate shift employeenumber employeename').lean().sort({
      employeenumber: 1,
      shift: 1,
      workdate: 1
    }).catch(err => console.log(err));

    //整理db数据为employeenumber->idnum,position->pos,(workdate->星期)+"_"+shift->time,employeename->name的格式,并返回结果数组,例如结果,[{ idnum: '2301', pos: 'busser', time: 'sat_am',name:'张三'},{...}] 
    let arr = [];
    //判断db是否为空,若为空,则返回空数组
    // console.log(db);
    if ((!db) || db.length == 0) {
      return arr;
    } else {
      for (let v of db) {
        let new_obj = {
          idnum: v.employeenumber,
          pos: v.position,
          time: (dateTrans.getWeekShortName(new Date(v.workdate).toLocaleDateString()) + "_" + v.shift).toLowerCase(),
          name: v.employeename
        };
        arr.push(new_obj);
      }
      // 打印发出去的数据
      // console.table(arr);
      return arr;
    }
  }

  //!response "表格填充蓝图"
  if (dates && dates.length > 0) {
    getData(dates).then(data => {
      res.json(data);
      res.end();
    });
  } else {
    console.log("日期请求数据错误或者为空");
    res.json([]);
    res.end();
  }


}); // ! |||||||end|||||||page table data onload||||||||||||||||||||||||




//!----------------------------------------------------------------------------------
module.exports = router;