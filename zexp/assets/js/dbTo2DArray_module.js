/*
 *数据库对象文件转换成二维数组
 *最终生成to2DArr(db,column_header=undefined,...params_row_headers)
 */

//!-----------------------------------------功能实现-------------------------------------------------
//*函数is2DArray(arr),判断arr是否为二维数组
function is2DArray(arr) {
  if (arr.length === 0) {
    console.log("arraysInArr is empty");
    return false;
  }
  if (!Array.isArray(arr)) {
    console.log("arraysInArr is not Array");
    return false;
  }
  for (let v of arr) {
    if (!Array.isArray(v)) {
      console.log("arraysInArr的子元素 is not Array");
      return false;
    }
  }
  return true;
}

//*函数isdb(db),判断是不是数据库格式,是就返回true
function isdb(db) {
  if (db.length == 0) {
    return false;
  }
  if (Object.prototype.toString.call(db) === '[object Array]' && typeof db[0] == "object") {
    for (let v of db) {
      if (Object.keys(v).length == 0) {
        return false;
      }
      return true;
    }
    return false;
  }
}

//*函数isKeyAndDb(db_data,key||keysArr),1.判断key或者key的数组集合是否都来自Db,2.并且判断db_data是否为数据库格式
function isKeyAndDb(db_data, key_or_keysArr, noValueAllow = false) {
  //检查db_data为数据库格式
  if (!isdb(db_data)) {
    console.log("db_data is not db");
    return false;
  }
  //如果noValueAllow==true,判断key_or_keysArr是否为undefined或者null或者 空字符串"",而后返回true
  if (noValueAllow) {
    if (key_or_keysArr == undefined || key_or_keysArr == null || key_or_keysArr == "") {
      return true;
    }
  }
  //检查key_or_keysArr为key或者key的数组集合
  if (key_or_keysArr == undefined) {
    console.log("key_or_keysArr is undefined");
    return false;
  }
  if (Object.prototype.toString.call(key_or_keysArr) === '[object Array]') {
    for (let v of key_or_keysArr) {
      if (typeof v != "string") {
        console.log("key_or_keysArr is not string");
        return false;
      }
    }
  } else if (typeof key_or_keysArr != "string") {
    console.log("key_or_keysArr is not string");
    return false;
  } else {
    key_or_keysArr = [key_or_keysArr];
  }

  //检查key_or_keysArr是否来自db_data
  let keysArrOfDb = getkeys(db_data);
  for (let v of key_or_keysArr) {
    if (!keysArrOfDb.includes(v)) {
      console.log("key_or_keysArr is not key of db_data");
      return false;
    }
  }
  return true;
}

//*标准化2d数组standard2dArr(array_2D,fillvalue=""),标准化二维数组, 返回一个矩形的数组的Array,空位填上fillvalue
function standard2dArr(array_2D, fillvalue = "") {
  //检查array_2D为数组

  if (!Object.prototype.toString.call(array_2D) === '[object Array]') {
    console.log("array_2D is not Array");
    return false;

  }

  let max_length = 0;
  for (let i = 0; i < array_2D.length; i++) {
    if (array_2D[i].length > max_length) {
      max_length = array_2D[i].length;
    }
  }
  for (let i = 0; i < array_2D.length; i++) {
    for (let j = 0; j < max_length; j++) {
      if (array_2D[i][j] == undefined) {
        array_2D[i][j] = fillvalue;
      }
    }
  }
  return array_2D;
}

//*二维数组转换成HTML,参数一为二维数组数据,参数二维table的id名。
function arrayToTableHTML(data, idStr) {
  var table = document.createElement('table');
  table.id = idStr;
  for (var i = 0; i < data.length; i++) {
    var row = document.createElement('tr');
    for (var j = 0; j < data[i].length; j++) {
      var cell = document.createElement(i === 0 ? 'th' : 'td');
      cell.textContent = data[i][j];
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  return table.outerHTML;
}

//*标准化数据库standardDb(db, keys_array = undefined, fillDate="")返回 新的 标准化数据库, 修整成的 矩形数据库
function standardDb(db, keys_array = undefined, fillDate = "") {
  //检查db为数据库格式
  if (!isdb(db)) {
    console.log("db is not db");
    return false;
  }

  //如果keys_array为空,那么给赋值所有的键名;如果有值,判断是否合法,keys_array用来改变键值对顺序
  if (keys_array == undefined || keys_array.length == 0) {
    keys_array = getkeys(db);
  } else if (new Set(...getkeys(db), ...keys_array).size !== new Set(...getkeys(db)).size) {
    console.log("keys is not all from db or miss some keys");
    return false;
  }

  //复制db,以免改变原数据库
  let dbdup = [];
  let keys = keys_array;

  for (let i = 0; i < db.length; i++) {
    let obj = new Object();
    for (let v of keys) {
      obj[v] = db[i][v] === undefined ? fillDate : db[i][v];
    }
    dbdup.push(obj);
  }

  return dbdup;
}

//*objToData(array_2D,callback),在二维数组里有obj的表里, 根据callback要求转化成所需要的值,例callback = function (obj) {return obj.name;}
function objToData(array_2D, callback) {
  //检查array_2D为数组
  if (!Object.prototype.toString.call(array_2D) === '[object Array]') {
    console.log("array_2D is not Array");
    return false;
  }
  //检查callback为函数
  if (typeof callback != "function") {
    console.log("callback is not function");
    return false;
  }

  let max_length = 0;
  for (let i = 0; i < array_2D.length; i++) {
    if (array_2D[i].length > max_length) {
      max_length = array_2D[i].length;
    }
  }
  for (let i = 0; i < array_2D.length; i++) {
    for (let j = 0; j < max_length; j++) {
      if (typeof array_2D[i][j] == "object") {
        array_2D[i][j] = callback(array_2D[i][j]);
      }
    }
  }
  return array_2D;
}

//*检查 键值存在所有db文档中,必须全有key键, 所有obj里的键有没有key, 只要有一个不存在就返回fasle
function checkallkey(db, key) {
  //检查db为数据库格式
  if (!isdb(db)) {
    console.log("db is not db");
    return false;
  }
  //检查key为键名
  if (!Object.prototype.toString.call(key) === '[object String]') {
    console.log("key is not String");
    return false;
  }


  if (db.length == 0 || key == undefined) {
    return false;
  };

  for (let i = 0; i < db.length; i++) {
    if (!db[i].hasOwnProperty(key)) {
      return false;
    }
  };
  return true;
}

//*getvalues(db,key)返回 升序 去重 键值,返回db中所有的obj数据里面key键的所有值values,写到Array里,升序 去重 后返回
function getvalues(db, key) {
  //检查db为数据库格式
  if (!isdb(db)) {
    console.log("db is not db");
    return false;
  }

  let set = new Set();
  for (let i = 0; i < db.length; i++) {
    if (db[i].hasOwnProperty(key)) {
      set.add(db[i][key]);
    }
  }
  //判断所有values,是否为日期'11/10/2023'或'1/2/1999'
  let allTrue = true;
  for(let item of set){
        if(!/^([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[12][0-9]|3[0-1])\/(19|20)\d\d$/.test(item)){
          allTrue=false;
          break;
        }
  }
  //如果所有的values为日期
  if(allTrue){
    //排序日期
    return Array.from(set).sort(function (a, b) {
      return new Date(a) -new Date(b);
    })
  }else{
    //排序普通值
   return Array.from(set).sort();
}
}

//*getkeys(db)返回去重 全部 键名, db中所有的obj数据里面key键名写到Array里,去重后返回
function getkeys(db) {
  //检查db为数据库格式
  if (!isdb(db)) {
    console.log("db is not db");
    return false;
  }

  //将所有键名写到set里,去重,再写到Array里,返回
  let set = new Set();
  for (let i = 0; i < db.length; i++) {
    for (let key in db[i]) {
      set.add(key);
    }
  }
  return Array.from(set);
}

//*getEliminatedKeys(db,...keyArr) 排除 某些 键名,返回*剩余键名 去重,  剩下的key写到Array里,去重后返回; 如果keyArr为空或undefined或Null,那么返回所有的key; 如果keyArr存在有非db里obj的键名,返回false; 如果keyArr去重后与db里obj的键名相同,顺序可以不同,那么就返回含空字符串的Array,即[""].
function getEliminatedKeys(db, ...keyArr) {
  //检查db为数据库格式
  if (!isdb(db)) {
    console.log("db is not db");
    return false;
  }

  let eliminatedKeys = [];
  let KeysSet = new Set();
  let KeysArr = [];
  let dbkeys = getkeys(db);
  if (keyArr.length == 0 || keyArr == undefined || keyArr == null) {
    return dbkeys;
  } else {
    KeysSet = new Set(keyArr);
    KeysArr = Array.from(KeysSet);

    for (let i = 0; i < KeysArr.length; i++) {
      //不包括该值,就错误;
      if (!dbkeys.includes(KeysArr[i])) {
        return false;
      } else {
        //将包含值从原数组中删除
        dbkeys.splice(dbkeys.indexOf(KeysArr[i]), 1);
      }
    }
  }
  if (dbkeys.length == 0) {
    eliminatedKeys.push("");
  }
  return dbkeys;
}

//*函数dbToMapsInArr(db,keys_array=undefined)将db数据库转换成Array包Map的格式,类似于表格,keys_array用来改变Map里的键值对顺序的
function dbToMapsInArr(db_data, keys_array = undefined) {
  //判断db_data是否为数据库格式
  if (!isdb(db_data)) {
    console.log("db_data is not db");
    return false;
  }

  //如果keys_array为空,那么给赋值所有的键名;如果有值,判断是否合法
  if (keys_array == undefined || keys_array.length == 0) {
    keys_array = getkeys(db_data);
  } else if (new Set(...getkeys(db_data), ...keys_array).size !== new Set(...getkeys(db_data)).size) {
    console.log("keys is not all from db or miss some keys");
    return false;
  }

  let db = standardDb(db_data);
  console.log(0, db);
  let arr = [];
  let keys = keys_array;


  for (let i = 0; i < db.length; i++) {
    let obj = new Map();
    for (let v of keys) {
      obj.set(v, db[i][v]);
    }
    arr.push(obj);
  }

  return arr;
}

//*函数dbTo2DArr(db,keys_array=undefined)将db数据库转换成Array包Array的格式,类似于表格,keys_array用来改变键值对顺序
function dbTo2DArr(db_data, keys_array = undefined) {
  //判断db_data是否为数据库格式
  if (!isdb(db_data)) {
    console.log("db_data is not db");
    return false;
  }
  //如果keys_array为空,那么给赋值所有的键名;如果有值,判断是否合法
  if (keys_array == undefined || keys_array.length == 0) {
    keys_array = getkeys(db_data);
  } else if (new Set(...getkeys(db_data), ...keys_array).size !== new Set(...getkeys(db_data)).size) {
    console.log("keys is not all from db or miss some keys");
    return false;
  }
  let db = standardDb(db_data);
  // console.log(0, db);
  let array = [];
  let keys = keys_array;

  for (let i = 0; i < db.length; i++) {
    let arr = new Array();
    for (let v of keys) {
      arr.push([v, db[i][v]]);
    }
    array.push(arr);
  }
  return array;
}

//*函数arr2DToDb(arraysInArr),返回db_data格式
function arr2DToDb(arrInArr) {
  //判断arraysInArr是否为二维数组
  if (!is2DArray(arrInArr)) {
    console.log("arraysInArr is not 2D Array");
    return false;
  };
  //判断arraysInArr的(孙元素)每个元素的每个元素是否为数组,并且为(一对值)长度为2
  for (let i = 0; i < arrInArr.length; i++) {
    for (let j = 0; j < arrInArr[i].length; j++) {
      if (Object.prototype.toString.call(arrInArr[i][j]) !== '[object Array]') {
        console.log("arraysInArr的子元素的子元素 is not Array");
        return false;
      }
      if (!arrInArr[i][j].length == 2) {
        console.log("arraysInArr的子元素的子元素长度不等于2");
        return false;
      }
    }
  }

  //定义db数组
  let db = [];
  for (let i = 0; i < arrInArr.length; i++) {
    //定义obj对象
    let obj = {};
    //将arraysInArr[i]的每个元素写入obj
    for (let v of arrInArr[i]) {
      obj[v[0]] = v[1];
    }
    db.push(obj);
  }
  return db;
}


/*//! obj排序函数dbsort(db, keys, length = keys.length) 按照提供的keys_array**顺序排列**db数据库
db为一数组，包含多个对象Object。即为db数据库。
keys为Object的部分或全部键名的集合Set，对arr里的Object进行排序。
keys长度不会超过Object全部的键名集合Set的长度。
length默认为keys的长度。
*/
function dbsort(db, keys, length = keys.length) {
  let k = keys.slice(0, length);
  let index = 0;
  if (length == 0) {
    return db;
  } else if (length > keys.length) {
    console.log("keys长度不能超过arr中Object的键名集合Set的长度");
    return false;
  }
  return recursiveSort(db, k, index);
  //递归排序
  function recursiveSort(arr, keys, index = 0) {
    if (index >= keys.length) {
      return arr;
    }
    arr.sort(function (a, b) {
      let [a1, b1] = [a[keys[index]], b[keys[index]]];
      // console.log(a1,b1);
      // console.log('a1',typeof a1 === "number");
      // console.log('b1',typeof b1 === "number");
      // console.log('a1&&b1',(typeof a1 === "number") && (typeof b1 === "number"));

      if (typeof a1 === "number" && typeof b1 === "number") {
        return a1 - b1;
        //a1,b1都是日期对象
      }else if(

        (typeof a1 === "object" && typeof b1 === "object") &&
        (a1 instanceof Date && b1 instanceof Date)
      
      ){
        return a1.getTime() - b1.getTime();
        //a1,b1都是字符串
      

      } else if ((typeof a1 === "string") && (typeof b1 === "string")) {
        //字符串按照字符的Unicode码点值进行比较
        return a1.toString().localeCompare(b1.toString());
      } else if ((typeof a1 === "number") && (typeof b1 === "string")) {
        return -1;
      } else if ((typeof a1 === "string") && (typeof b1 === "number")) {
        return 1;
        //有可能值是空的undefined,也要交换位置
      } else {
        return 0;
      }
    });
    let i = 0;
    while (i < arr.length) {
      let temp = [];
      while (arr[i + 1] && arr[i][keys[index]] == arr[i + 1][keys[index]]) {
        temp.push(arr[i]);
        i++;
      }
      temp.push(arr[i]);
      temp = recursiveSort(temp, keys, index + 1);
      arr.splice(i - temp.length + 1, temp.length, ...temp);
      i++;
    }
    return arr;
  }
}

//!函数to2DArr(db_data, key1_columnHeader, key2_rowHeaders,key3_tableData) 返回db数据库转换成二维数组,类似于表格,key1必须为一个键名或者没有,key2 key3可以为多个键名
//?情况1:如果key1为空,并且key2_rowHeaders为空,那么将所有的键名,即getkeys(db)的值(db全部键名)写到二维数组的第一行(即table header),而后每行填写的table data为该db Object键值,其中如果键值缺失就为空字符串""
function to2DArrCS1(db_data) {
  //判断db_data是否为数据库格式
  if (!isdb(db_data)) {
    console.log("db_data is not db");
    return false;
  }

  let header = [];
  let key1 = key1_columnHeader;
  let db = db_data;
  let arr = [];

  if (key1 == undefined || key1 == null || key1.length == 0 || checkallkey(db, key1)) {
    header = getkeys(db);

    //数组第一行表头写要求的键值
    arr.push(header);
    for (let i = 1; i <= db.length; i++) {
      for (let j = 0; j < header.length; j++) {
        if (db[i - 1][header[j]] == undefined) {
          if (arr[i] == undefined) {
            arr[i] = [];
          }
          arr[i].push("");
        } else {
          if (arr[i] == undefined) {
            arr[i] = [];
          }
          arr[i].push(db[i - 1][header[j]]);
        };
      };
    };
  };
  return arr;
}

//?情况2:如果key1有值,并且key2_rowHeaders为空,那么将键名所有的键值,即getvalues(db,key)的值写到二维数组的第一行,而后每行(填写键值)数据与键值对应,每一行代表其中一个obj,其中如果键值缺失就为空字符串""
function to2DArrCS2(db_data, key1_columnHeader) {
  //判断key1_columnHeader是否为键名,并且判断db_data是否为数据库格式
  if (!isKeyAndDb(db_data, key1_columnHeader)) {
    return false;
  }

  let header = [];
  let key1 = key1_columnHeader;
  let db = db_data;
  let arr = [];
  header = getvalues(db, key1);
  //键值排序升序
  header;

  //数组第一行表头写要求的键值
  arr.push(header);

  //计数每列有几个匹配成功了,第0行已经使用,从1开始
  let count = new Array(header.length).fill(1);
  //遍历db所有obj
  for (let i = 1; i <= db.length; i++) {
    //遍历header所有键值,和每个obj里的键值比对
    for (let j = 0; j < header.length; j++) {
      //比对成功,将obj写到二维数组中,arr[1]开始
      if (db[i - 1][key1] == header[j]) {
        //数组为空, 那么就创建一个新的数组,并将obj写入
        if (arr[count[j]] == undefined) {
          arr[count[j]] = [];
        }
        arr[count[j]][j] = db[i - 1];
        //成功增加一次,计数器加一
        count[j]++;
      }
    };
  };
  return arr;
};

//?情况3:如果key1为空,"key2_rowHeaders"有值,那么将那么将所有的键名,即getkeys(db)的值写到二维数组的第一行,然后将obj按顺序写到二维数组中
function to2DArrCS3(db_data, key2_rowHeaders) {
  //判断db_data是否为数据库格式,并且key2_rowHeaders是否为键名
  if (!isKeyAndDb(db_data, key2_rowHeaders)) {
    console.log("db_data is not db");
    return false;
  }
  //判断key2是否为数组,如果转为数组
  if (!(Array.isArray(key2_rowHeaders))) {
    key2_rowHeaders = [key2_rowHeaders];
  }


  //按照key2_rowHeaders的顺序 进行排序
  let db = dbsort(db_data, key2_rowHeaders);
  let key2 = key2_rowHeaders;
  let header = [];
  let arr = [];
  //db中的键名赋值给header
  header = getkeys(db);
  //数组去重
  key2 = Array.from(new Set(key2));

  //arr每行的arr[len]位置开始往后逐个添加数据
  arr.push(key2);
  arr[0].push(...header);
  // console.log(arr);
  //从arr的第二行开始添加每一个obj的对应键值
  for (let [k, v] of db.entries()) {
    for (let [i, j] of arr[0].entries()) {
      // console.log('k:'+k,'v:'+v,'i:'+i,'j:'+j);
      if (arr[k + 1] == undefined) {
        arr[k + 1] = [];
        // console.log(arr[k + 1][i], v[j]);
      }
      arr[k + 1][i] = v[j];
    }
  }
  return arr;


}; //to2DArrCS3结束

//?情况4:如果key1有值,"key2_rowHeaders"也有值,那么第一行为'key2键名'+'key1可对应的全部键值',而后每行填写'key2的键值'+'对应的obj'
function to2DArrCS4(db_data, key1_columnHeader, key2_rowHeaders) {
  //判断db_data是否为数据库格式,判断key1_columnHeader和key2_rowHeaders是否为键名
  if (!(isKeyAndDb(db_data, key1_columnHeader) && isKeyAndDb(db_data, key2_rowHeaders))) {
    return false;
  }

  //判断key2是否为数组,如果转为数组
  if (!(Array.isArray(key2_rowHeaders))) {
    key2_rowHeaders = [key2_rowHeaders];
  }

  let header = [];
  let key1 = key1_columnHeader;
  let key2 = key2_rowHeaders;
  let db = dbsort(db_data, key2_rowHeaders);
  let arr = [];
  header = getvalues(db, key1);
  //数组去重
  key2 = Array.from(new Set(key2));

  //arr每行的arr[len]位置开始往后逐个添加数据
  arr.push([]);
  arr[0].push(...key2);
  arr[0].push(...header);

  // console.log(arr);
  //从arr的第二行开始添加每一个obj的对应键值
  for (let [k, v] of db.entries()) {
    for (let [i, j] of arr[0].entries()) {
      // console.log('k:'+k,'v:'+v,'i:'+i,'j:'+j);
      if (arr[k + 1] == undefined) {
        arr[k + 1] = [];
      }
      if (i < key2.length) {
        arr[k + 1][i] = v[j];
      } else {
        arr[k + 1][i] = v;

      }

    }
  }
  return arr;

}; //to2DArrCS4结束

//?情况5:如果输出的二维数组中有Object值,可根据要求保留相应键值,如果没有参数就保留字符串"obj".
function to2DArrCS5(arr2D_includeObj, db_data, key1_columnHeader, key3_tableData) {
  //判断arr2D_includeObj是否为二维数组,判断key1_columnHeader和key3_rowHeaders是否为键名,允许其为空值
  if (!is2DArray(arr2D_includeObj) && isKeyAndDb(db_data, key1_columnHeader, true) && isKeyAndDb(db_data, key3_tableData, true)) {
    return false;
  }


  let key1 = key1_columnHeader;
  let key3 = key3_tableData;
  let arr = arr2D_includeObj;
  //判断keys是否为数组,如果不是就转为数组
  if (!(Array.isArray(key3))) {
    key3 = [key3];
  }
  //遍历二维数组
  for (let [i, iv] of arr.entries()) {
    //遍历每一行
    for (let [j, jv] of iv.entries()) {
      //如果j是Object,那么就根据key3键名获取键值,并用键值替换原来的Object
      if (Object.prototype.toString.call(jv) === '[object Object]') {
        //判断当前列的表头是否为当前obj内的键值,若不是,赋值当前表格arr[i][j]为空 "",跳到下一循环
        if (jv[key1] != arr[0][j] && (key1 != undefined && key1 != '' && key1 != null)) {
          arr[i][j] = "";
          continue;
        }
        //如果key3为空,那么显示为"obj"
        if (key3[0] == undefined) {
          arr[i][j] = "obj";
        }
        //如果key3有值,判断key3是否合法
        else if (key3[0] != undefined) {
          for (let [k, kv] of key3.entries()) {
            if (k == 0) {
              arr[i][j] = `${jv[kv]}`;
            } else {
              arr[i][j] += `,${jv[kv]}`;
            }

          }
        }

      }
    }
  }
  return arr;
}

//!合并不同情况, 函数to2DArr(db_data, key1_columnHeader, key2_rowHeaders,key3_tableData) 返回db数据库转换成二维数组,类似于表格,key1必须为一个键名或者没有,key2 key3可以为多个键名
function to2DArr(db_data, key1_columnHeader, key2_rowHeaders, key3_tableData) {
  //赋值新建变量名,先标准化db数据库
  let db = db_data;
  let key1 = key1_columnHeader;
  let key2 = key2_rowHeaders;
  let key3 = key3_tableData;

  //判断db_data是否为数据库格式,判断key1_columnHeader,key2_rowHeaders,key3_tableData是否为键名,允许其为空值
  if (!isKeyAndDb(db, key1, true) && isKeyAndDb(db, key2, true) && isKeyAndDb(db, key3, true)) {
    console.log("to2DArr: 判断db,key1,key2,key3,其中有值合法");
    return false;
  }
  //定义判断为空函数,方便复用
  function isEmp(val) {
    if (val == undefined || val == '' || val == null) {
      return true;
    }
  }
  //判断key1,key2,key3不同情况
  let tArr;
  switch (true) {
    //情况1
    case isEmp(key1) && isEmp(key2):
      return to2DArrCS1(db);
    //情况2
    case !isEmp(key1) && isEmp(key2):
      return to2DArrCS2(db, key1);
    //情况3,tdata有obj
    case isEmp(key1) && !isEmp(key2):
      tArr = to2DArrCS3(db, key2);
    //使用情况5,转换obj值
    return to2DArrCS5(tArr, db, key1, key3);
    //情况4,tdata有obj
    case !isEmp(key1) && !isEmp(key2):
      tArr = to2DArrCS4(db, key1,key2);
    //使用情况5,转换obj值
    return to2DArrCS5(tArr, db, key1, key3);
    default:
    return false;
  }
}

// !----------------------------------------------测试代码--------------------------------------------------
//设定测试样本db数据库
// let db = [{
//     "id": 0,
//     "name": "8张大",
//     "age": 18,
//     "code": "60"
//   },
//   {
//     "id": 1,
//     "name": "1张三",
//     "age": 18,
//     "code": "90"
//   },
//   {
//     "id": 2,
//     "name": "3张2",
//     "age": 18,
//     "code": "60"
//   },
//   {
//     "id": 3,
//     "name": "2李四",
//     "age": 19,
//     "code": "60"
//   },
//   {
//     "id": 4,
//     "name": "1李2",
//     "age": 19,
//     "code": "90"
//   },
//   {
//     "id": 5,
//     "name": "1李1",
//     "age": 18,
//     "code": "67"
//   },
//   {

//     "id": 6,
//     "name": "4王五",
//     "age": 17,
//     "code": "70"
//   },
//   {

//     "id": 7,
//     "name": "2小五",

//     "code": "60"
//   },
//   {

//     "id": 8,
//     "name": "6张五哥",
//     "age": 18,
//     "code": "60"
//   },
//   {

//     "id": 9,
//     "name": "7王理",
//     "age": 17,
//     "code": "60"
//   },
//   {

//     "id": 10,
//     "name": "4王五",
//     "age": 17,
//     "code": "69",
//     "date":"11/1/2023"
//   },
//   {

//     "id": 11,
//     "name": "9王二小",
//     "age": 17,
//     "code": "65",
//     "date":"11/10/2023"
//   },
//   {
//     "id": 12,
//     "name": "10李2",
//     "age": 19,
//     "code": "90",
//     "date":"11/6/2023"
//   }
// ];
// let n = to2DArrCS4(db, 'age', ['code', 'name']);
// console.table(to2DArrCS5(n, db, '', ['id', 'name']));
// console.table(to2DArr(db, 'age', ['code', 'name'], ['id', 'name']));

// console.log(getvalues(db,"date"));



//!导出所有功能模
module.exports = {
    dbsort,
    to2DArr,
    is2DArray,
    isdb,
    isKeyAndDb,
    standard2dArr,
    standardDb,
    arrayToTableHTML,
    objToData,
    checkallkey,
    getvalues,
    getkeys,
    getEliminatedKeys,
    dbToMapsInArr,
    dbTo2DArr,
    arr2DToDb
};
    
