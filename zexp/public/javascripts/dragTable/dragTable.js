const container = document.querySelector('.container');
let packNode = null;
let packNodeParent = null;
container.ondragstart = function (e) {
  e.dataTransfer.effectAllowed = e.target.dataset.effect;
  // console.log("start", e, e.target);
  packNode = e.target;
  packNodeParent = packNode.parentNode;

};
container.ondragover = function (e0) {
  //阻止默认行为,默认table上不允许drop元素
  e0.preventDefault();

};
//clear(),清楚所有的class为drag-enter的样式
let clear = function () {
  document.querySelectorAll(".drag-enter").forEach(item => {
    item.classList.remove("drag-enter");
  });
};

//获得dropNode,如果节点没dropif数据,那么查看其祖先元素有没,直到最后

let getDropNode = function (node) {
  // console.log("let getDropNode = function (node) {下面", node);
  while (node) {
    // console.log("getDropNode里的dropif", node, node.dataset);
    if (node.dataset) {
      if (node.dataset.dropif) {
        return node;
      };
    };
    node = node.parentNode;
  }
};

container.ondragenter = function (e0) {
  //进入先清除所有class为drag-enter的样式
  clear();
  //拖拽进入时,添加drag-enter样式
  const dropNode = getDropNode(e0.target);
  //判断dropNode是否允许drop,元素的接受节点(受体)的dropIf条件code是与要被传递(包裹体)的允许操作效果code一致
  if (dropNode && dropNode.dataset && dropNode.dataset.dropif == "copy" || dropNode && dropNode.dataset && dropNode.dataset.dropif == "move") {
    dropNode.classList.add("drag-enter");
  }
};




container.ondrop = function (e0) {
  // console.log("container.ondrop = function (e0) {下面", e0, e0.target);
  //拖拽放下时,清楚drag-enter
  clear();
  //拖拽放下时,将拖拽的元素放入目标元素
  const dropNode = getDropNode(e0.target);
  //获取dropNode元素的data-time数据
  let dropNodeTime = dropNode.dataset.time;
  //获取data-time与dropNodeTime相同值的所有元素
  let dropNodeSameTime = document.querySelectorAll(`[data-time="${dropNodeTime}"]`);
  // console.log("dropNodeSameTime", dropNodeSameTime);

  //!判断dropNode是否允许drop,元素的接受节点(受体)dropIf条件code与要被传递(包裹体)的允许操作效果"code一致identical"
  if (dropNode && dropNode.dataset && dropNode.dataset.dropif == e0.dataTransfer.effectAllowed) {
    // console.log(dropNode.dataset.dropif, dropNode.dataset.dropif === "copy");

    //?当dropNode为 "copy" 的情况--------------
    if (dropNode.dataset.dropif === "copy") {
      //从选择区复制packNode,并且放入填写区dropNode
      //克隆原packNode
      packNodeCopy = packNode.cloneNode(true);
      packNodeCopy.dataset.effect = "move";

      //forEach所有dropNodeSameTime元素
      let ishas = false;
      dropNodeSameTime.forEach(item => {
        //获取dropNodeSameTime元素里的子节点
        let dropNodeKids = item.children;

        //检查填写区dropNodeKids中是否有与packNodeCopy相同的子元素,如果有,那么就不再appendChild,如果没有,那么就appendChild
        if (dropNodeKids.length > 0) {

          for (let v of dropNodeKids) {
            if (packNodeCopy.isEqualNode(v)) {
              ishas = true;
              // console.log("有相同元素了");
              break;
            };
          };
        };
      });
      //确认ishas为fasle,即整个time时间段没有相同元素
      if (!ishas) {
        dropNode.appendChild(packNodeCopy);

      };


      //?当dropNode为 "move" 的情况-----------------
    } else if (dropNode.dataset.dropif === "move") {
      //packNode返回选择区,删除packNode
      packNode.remove();
    };
  //!判断dropNode是否允许drop,元素的接受节点(受体)的dropIf条件code是与要被传递(包裹体) "code不一致different"
  } else if (dropNode && dropNode.dataset && dropNode.dataset.dropif == "copy" && packNode.dataset.effect === "move") {
    //?packNode在填写区移动,移到 "different时间段" 和 "same时间段" 的位置dropNode

    //forEach所有dropNodeSameTime元素
    let ishas = false;
    let numhas = 0;
    dropNodeSameTime.forEach(item => {
      //获取dropNodeSameTime元素里的子节点
      let dropNodeKids = item.children;
      //检查填写的大区的所有子元素dropNodeKids中是否有与packNodeCopy相同的子元素,如果有,那么就不再appendChild,如果没有,那么就appendChild
      if (dropNodeKids.length > 0) {
        
        for (let v of dropNodeKids) {
          if (packNode.isEqualNode(v)) {
            //?packNode在填写区移动,"特别情况"---移到 "same时间段" 的位置dropNode
            if(packNodeParent.dataset.time==dropNode.dataset.time && numhas == 0){
              numhas++;
              continue;
            }else{
              ishas = true;
            };
            // console.log("有相同元素了");
            break;
          };
        };
      };
    });
    if (!ishas) {
      dropNode.appendChild(packNode);
    } ;
  };
}