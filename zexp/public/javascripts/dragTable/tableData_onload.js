//加载按钮点击事件函数
function gopage1(){
  window.location.href=serverNetAddress+"/employee";
}
function gopage2(){
  window.location.href=serverNetAddress+"/work-schedule";
}


/*
 *初始化表头日期
 */
//获取表头上两个p元素
let table_date = document.getElementById('table_date');
table_date.innerText = new Date().toLocaleDateString();
//获取table_date的下一个兄弟元素
let table_date_next = table_date.nextElementSibling;
table_date_next.innerHTML = dateTrans.weektodate("sun", table_date.innerText);


/*
 *定义一个异步函数:fill the "填表div"
 *填表的根据数据库返回的"整周的图表蓝图"
 *需要根据table里的日期,给主机发request,{date="日期"}
 */
//定义个urlTpr
let urlTpr = serverNetAddress + "/admin/tabledata?date=";
//从id="table_date"的元素中获取innerText,并赋值给date
let date = table_date.innerText;

//!定义一个异步函数,参数("要求的日期","主机url")
async function tableData_onload(date, url = urlTpr) {
  //?获取可拖拽的 "填表div" 的集合数据
  let tableDivs = document.querySelectorAll('div.left>div');
  let divClassNameMap = new Map();
  for (let v of tableDivs) {
    //获取class属性值
    var newStr = v.className
    divClassNameMap.set(v.dataset.idnum, newStr);

  }

  //?获取所有的带有data-dropif属性的td元素
  let tableCell = document.querySelectorAll('td[data-dropif]');

  //!request "填表蓝图"
  let tableBlueprint = await fetch(url + `${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).catch(err => console.log(err));

  // console.log(tableBlueprint);

  //!according "填表蓝图" to fill the "填表div"
  /*
  将td元素中的data-time属性值和tableBlueprint中的time属性值进行比较,如果相同,则根据tableBlueprint相应的idnum值,去divClassNameMap查找对应的键值,并且把divClassNameMap找的键值添加到td元素的innerHTML中
  */

  for (let e of tableCell) {
    for (let b of tableBlueprint) {
      if (e.dataset.time == b.time && e.dataset.pos == b.pos) {
        let divClassName = divClassNameMap.get(b.idnum);
        if (divClassName) {
          //modify the "填表div" of the td element
          e.innerHTML += `<div data-effect="move" draggable="true" class="${divClassName}" data-idnum="${b.idnum}">${b.name}</div>`;
        } else {
          e.innerHTML += `<div data-effect="move" draggable="true" class="item" data-idnum="${b.idnum}">${b.name}</div>`;
        }
      }
    }
  }
}

//!run the function

async function dragblock_then_tableData(date){
  await dragblock_onload();
  await tableData_onload(date);
}

//执行 dragblock_then_tableData(date)

dragblock_then_tableData(date);



/*
*页面选择的日期改变,fresh页面

*/
//?定义清表函数clearTable()

function clearTable() {
  let tableCell = document.querySelectorAll('td[data-dropif]');
  for (let e of tableCell) {
    e.innerHTML = "";
  };
}

//?设定"上周""下周"按钮的function

//获取输入框元素
var dateInput = document.getElementById('dateInput');

//设置初始日期为今天,规避世界时
var now = new Date().toLocaleDateString();
dateInput.valueAsDate = new Date(now);

function goUp() {
  // 向上滚动一周
  var date = new Date(dateInput.value);
  date.setDate(date.getDate() - 7);
  dateInput.valueAsDate = date;
  dateInput.dispatchEvent(new Event('input')); // 手动触发input事件
}

function goDown() {
  // 向下滚动一周
  var date = new Date(dateInput.value);
  date.setDate(date.getDate() + 7);
  dateInput.valueAsDate = date;
  dateInput.dispatchEvent(new Event('input')); // 手动触发input事件
}

//?更新表头上的日期


//监听输入框的input事件
document.getElementById('dateInput').addEventListener('input', function () {
  // console.log('输入框的值已经改变，新的值是：' + this.value);
  table_date.innerHTML = dateTrans.weektodate("mon", dateTrans.dateformat(this.value));
  //修改table_date_next的innerHTML
  table_date_next.innerHTML = dateTrans.weektodate("sun", table_date.innerText);

  //!刷新页面
  //清除tableCell原有数据
  clearTable();
  tableData_onload(dateTrans.dateformat(this.value));
});


/*
 *选择日期,插入该日期的数据到表格中,从而修改当周表格的内容
 
 */
// 获取模态对话框元素
var modal = document.getElementById("myModal");

// 获取按钮元素
var btnChange = document.getElementById("btnChange");

// 获取 <span> 元素，用于关闭模态对话框
var span = document.getElementsByClassName("close")[0];

// 点击按钮时，打开模态对话框
btnChange.onclick = function () {
  modal.style.display = "block";
}

// 点击 <span> (x)，关闭模态对话框
span.onclick = function () {
  modal.style.display = "none";
}

// 在用户点击其他地方时，关闭模态对话框
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// 提交日期
async function submitDate() {
  var date = await document.getElementById("datePicker").value;
  console.log("选择的日期是：" + date);
  // 在这里，你可以将日期发送到后台
  modal.style.display = "none";
  //刷新页面
  //先清楚tableCell原有数据
  await clearTable();
  //再重新填充tableCell数据
  await tableData_onload(date);
}
//点击modal按钮,执行操作
submitDate();