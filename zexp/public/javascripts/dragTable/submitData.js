//获取所有节点
var tds = document.querySelectorAll('td');
let btn = document.getElementById('btn');


btn.onclick = function () {
     let divs = [];
     //在tds中获取子节点,选择有div的节点放到divs下
     for (let i = 0; i < tds.length; i++) {
          tds[i].childNodes.forEach(element => {
               if (element.localName == "div") {
                    divs.push(element);
               };
          });
     };
     // console.log(divs);
     /*employeename: "xiaozhang",
       employeenumber: "2312",
       workdate: "10/28/2023",
       shift: "am",
       createdate: new Date,
       position: "sever",
       remarks: ""
     */
     //按照以上结构从divs中获取数据并赋值给workSchedules对象集合

     let workSchedules = [];
     workSchedules = divs.map(
          (node) => {
               //判断node里的dataset-time是否为am或者pm,如果为pm返回true
               // console.log(node.parentNode.dataset.time.slice(-2, ));
               let shift = node.parentNode.dataset.time.slice(-2, );

               //获取week周几,转化为日期
               let week = node.parentNode.dataset.time.slice(0, 3);
               // let workdate = dateTrans.weektodate(week);
               let workdate = dateTrans.weektodate(week,document.getElementById('table_date').innerText);

               //返回一个对象,格式为workSchedules对象集合的格式
               let obj = {
                    employeename: node.innerText,
                    employeenumber: node.dataset.idnum,
                    //todo 这里的时间格式是yyyy-mm-dd hh:mm:ss,这里要改成mm/dd/yyyy
                    workdate,
                    shift,
                    createdate: new Date(),
                    position: node.parentNode.dataset.pos,
                    remarks: ""
               };
               return obj;
          });
     // console.log("workSchedules:",workSchedules,typeof workSchedules);
     submitData(workSchedules)
          .then(res => alert(res))
          .catch(err => console.log("err:" + err));
};


//定义一个提交数据函数
async function submitData(data) {
     let resResult = await fetch(serverNetAddress+'/admin/submit', {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
     });
     let jsonResult = await resResult.json();
     //手动暂停2秒后再打印
    
     console.log("submitData response.json():", jsonResult);
     return jsonResult;
};