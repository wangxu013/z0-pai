
async function dragblock_onload(){
//发送fetch 请求到 服务器,得到 employee数据ep_db
let ep_db_t=await fetch(serverNetAddress+'/admin/getemployeedb').catch(err=>{console.log("fetch得到ep db err:"+err);})
let ep_db = await ep_db_t.json();

//获得left元素,共3个,父1个,子2个
let left=document.querySelectorAll(".left");

//清楚left的内容
left[1].innerHTML="";
left[2].innerHTML="";

//定义变量add用于存放拼接的内容
let add1='';
let add2='';

//将db写入add
for(let i=0;i<ep_db.length;i++){
    //如果是onJob,则加入add1
    if(ep_db[i].status=="onJob"){
    add1 += `<div data-effect="copy" draggable="true" class="color${i+1} item" data-idnum="${ep_db[i].number}">${ep_db[i].name}</div>`;
    //如果不是,则加入add2
    }else{
    add2 += `<div data-effect="copy" draggable="true" class="color${i+1} item" data-idnum="${ep_db[i].number}">${ep_db[i].name}</div>`;
    }
}


//将add写入
left[1].innerHTML = add1;
left[2].innerHTML = add2;
}

//carry out dragblock_onload
//到tableData_onload文件中去执行,先dragblock_onload(),再tableData_onload(date)