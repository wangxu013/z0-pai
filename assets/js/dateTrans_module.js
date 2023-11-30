//判断字符串是否为月份数
function isMonthNum(str) {
  return /^(0[1-9]|1[0-2]|[1-9])$/.test(str);
  // return str.length <= 2 && /^(0[1-9]|1[0-2]|[1-9])$/.test(str);
}

//判断字符串是否为几号数
function isDayNum(str) {
  return /^(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])$/.test(str);
  // return str.length <= 2 && /^(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])$/.test(str);
}

//判断字符串是否为年份数
function isYearNum(str) {
  return /^(19|20)\d{2}$/.test(str);
  // return str.length == 4 && /^(19|20)\d{2}$/.test(str);
}

//星期转日期, 用 "周几",或者 "周几","日期date",返回默认本周的 或者 date所在周的,相同星期的日期数据
function weektodate(weekStr, date) {
  //参数为 mon 10/12/2023,date的限制不多,只要能解析为时间即可

  if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/i.test(weekStr)) {
    let n = 0;
    switch (true) {
      case /^(Mon|Monday)$/i.test(weekStr): n = 1; break;
      case /^(Tue|Tuesday)$/i.test(weekStr): n = 2; break;
      case /^(Wed|Wednesday)$/i.test(weekStr): n = 3; break;
      case /^(Thu|Thursday)$/i.test(weekStr): n = 4; break;
      case /^(Fri|Friday)$/i.test(weekStr): n = 5; break;
      case /^(Sat|Saturday)$/i.test(weekStr): n = 6; break;
      case /^(Sun|Sunday)$/i.test(weekStr): n = 7; break;
    };
    //判断date是否为空,为空则默认为当天
    let dateL = "";
    if (date) {
      dateL = new Date(date).toLocaleDateString();
    } else {
      dateL = new Date().toLocaleDateString();
    };
    // console.log("date=" + dateL);

    //获取weekNum,星期几
    let weekNum = new Date(dateL).getDay();

    weekNum = (weekNum == 0) ? 7 : weekNum;
    let diff = n - weekNum;
    //星期简写-->本周日期----例如,把"Mon"最终生成本周周一的日期数据
    date = new Date(new Date(dateL).getFullYear(), new Date(dateL).getMonth(), new Date(dateL).getDate() + diff, new Date(dateL).getHours(), new Date(dateL).getMinutes(), new Date(dateL).getSeconds());
    // console.log("date="+date);
    //日期数据字符串化,格式转为"10/25/2023"的格式
    date = date.toLocaleDateString();
    return date;
  }
}

//规范date数据格式,转为"10/25/2023"的格式
function dateformat(date) {
  /*日期数据字符串,输入的参数 仅仅可以有4种格式:
    1.仅有一个字母的样式,如 "Mon", "mon";
    2.仅有一个数字的样式,如 25 , "25";
    3.含有"/"的样式,如"10/25/2023", "10/25";
    4.含有"-"的样式,如"2023-10-25", "10-25";
  //!根据以上4种格式,对date进行判断,并转化为"10/25/2023"的格式
  */
  
  try {

    //判断date为星期几,缺月份,缺年份,默认为当前年月周内的星期几,转化为日期数据
    if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/i.test(date)) {
      return weektodate(date);

      //判断date为月份号数,缺月份,缺年份,默认为当前年月份
    } else if (isDayNum(date)) {
      let today = new Date().toLocaleDateString();
      date = today.split("/")[0] + "/" + date + "/" + today.split("/")[2];
      //判读号数是不是超出该月的最大号数
      if(new Date(date).getMonth() == new Date().getMonth()){
        return date;
      }else{
        throw "输入的号数在该月中不存在!!!";
      }
      //判断date为xx/xx/xxxx格式,或者x/x/xxxx格式
    } else if (date.trim().split("/").length == 3 && Date.parse(date) && isYearNum(date.trim().split("/")[2])) {
      return new Date(date).toLocaleDateString();
      //判断date为xx/xx格式,或者x/x格式,缺年份默认为当前年份

    } else if (date.trim().split("/").length == 2 && Date.parse(date + "/" + new Date().getFullYear())) {
      return new Date(date + "/" + new Date().getFullYear()).toLocaleDateString();
      //判断date为xxxx-xx-xx格式,或者xxxx-x-x格式
    } else if (date.trim().split("-").length == 3 && Date.parse(date) && isYearNum(date.trim().split("-")[0])) {
      return new Date(date + " ").toLocaleDateString();
      //判断date为xx-xx格式,或者x-x格式,缺年份默认为当前年份
    } else if (date.trim().split("-").length == 2 && Date.parse(new Date().getFullYear) + "-" + date) {
      return new Date(new Date().getFullYear() + "-" + date + " ").toLocaleDateString();
      //都不是,抛出异常
    } else {
      throw "input date error";
    };

  } catch (error) {
    return undefined;
  }
}

//测试dateformat函数
// console.log("mon", dateformat("mon"));
// console.log(25, dateformat("25"));
// console.log("10/25/2023", dateformat("10/25/2023"));
// console.log("10/25", dateformat("10/25"));
// console.log("2023-10-25", dateformat("2023-10-25"));
// console.log("10-25", dateformat("10-25"));
// console.log("31", dateformat("31"));
// console.log("3", dateformat("3"));
// console.log("1819-10-11", dateformat("1819-10-11"));
// console.log("1-2", dateformat("1-2"));
// console.log("2023-  2-23", dateformat("2023-  2-23"));

//获取整周的日期,返回Array存储其日期数据,格式为10/25/2023
function getWeekDate(date) {
  let weekDate = [];
  weekDate.push(weektodate("Mon", date));
  weekDate.push(weektodate("Tue", date));
  weekDate.push(weektodate("Wed", date));
  weekDate.push(weektodate("Thu", date));
  weekDate.push(weektodate("Fri", date));
  weekDate.push(weektodate("Sat", date));
  weekDate.push(weektodate("Sun", date));
  return weekDate;
}

//获取周一的日期,输入date参数,返回周一日期数据,如果参数为空,返回本周周一日期数据
function getMonDate(date) {
  return weektodate("Mon", date);
}

//获取星期的简写数据,输入date参数,返回星期的简写,例如"Mon", "Thu", "Sun"等等
function getWeekShortName(date) {
  return new Date(date).toUTCString().slice(0, 3);
}

//判断两个日期是否在同一年的同一周
function isSameWeek(date1, date2) {
  return getMonDate(date1) == getMonDate(date2);
}

//判断单个date或者dates数组,是否为“Month/Day/Year” 格式:日期'11/10/2023'或'1/2/1999'
function isMDYdate(date_datesArr) {
  let arr=[];
  //如果参数不是数组
  if (!Array.isArray(date_datesArr)) {
    arr.push(date_datesArr);
  }else{
    arr = date_datesArr;
  }
  let set = new Set(arr);
  let allTrue = true;
  for (let item of set) {
    if (!/^([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[12][0-9]|3[0-1])\/(19|20)\d\d$/.test(item)) {
      allTrue = false;
      break;
    }
  }
  return allTrue;
}

//数组排序,给非日期或日期排序datesAndothersSort(),日期格式为m/d/y
function datesAndothersSort(datesArr_nonDates) {
  //如果所有的values为日期
  if (isMDYdate(datesArr_nonDates)) {
    //排序日期
    return Array.from(datesArr_nonDates).sort(function (a, b) {
      return new Date(a) - new Date(b);
    })
  } else {
    //排序普通值
    return Array.from(datesArr_nonDates).sort();
  }
}





//封装到一个日期转化的对象中去
const dateTrans = {
  weektodate,
  dateformat,
  getWeekDate,
  getMonDate,
  getWeekShortName,
  isSameWeek,
  isMDYdate,
  datesAndothersSort
};

//输出对象
module.exports = dateTrans;

//测试
// console.log(dateTrans.weektodate("Mon", "10/12/2023"));
// console.log(dateTrans.dateformat("Mon"));
// console.log(dateTrans.getWeekDate("10/12/2023"));
// console.log(dateTrans.getMonDate("11/4/2023"));
// console.log(dateTrans.getWeekShortName("11/04/2023"));

// console.log(isMDYdate(['11/28/2023', '12/28/2023']));