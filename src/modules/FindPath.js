//  获取坐标n周围可扩展路径
function getAround(n, maps) {
    return [n - 1, n - 11, n + 1, n + 11].filter(num => {
        //  防止最左减1后变最右
        if( (n - 1) % 11 === 10 ) return num >= 0 && num < 121 && (maps[num] === null || maps[num].type === 'event') && num % 11 !== 10;
        //  防止最右加1后变最左
        if( (n + 1) % 11 === 0 ) return num >= 0 && num < 121 && (maps[num] === null || maps[num].type === 'event') && num % 11 !== 0;
        return num >= 0 && num < 121 && (maps[num] === null || maps[num].type === 'event');
    });
}

//  通过关系队列找出路径
function getPath(relation, end) {
    //  用来存放最终路径
    let path = [];
    //  初始化为最终目标点，然后通过改变该变量，达到不断搜索最终点到起始点之间的直接路径。
    let target = end;
    function loop() {
        //  循环关系队列，从最终点开始，根据每个节点的父节点最终找到起始点。
        for (let i = 0; i < relation.length; i++) {
            //  如果当前节点是target，继续递归搜索，直到所有节点中不存在target结束。（由于起始点没有父节点，所以最终target会变成undefined。）
            if (relation[i].value === target) {
                path.unshift(relation[i].value);
                //  将当前target指向当前节点的父节点，然后递归继续查找。
                target = relation[i].parent;
                //  删除当前节点，减少下次循环次数。
                relation.splice(i, 1);
                loop();
                break;
            }
        }
    }
    loop();
    return path;
}

//  广度优先搜索
function bfs(start, end, map) {
    //  未检测或待检测列表
    let openList = [];
    //  已检测列表
    let closeList = [];
    //  出队后的检测点
    let g = null;
    //  存储已检测点的关系谱，用来获得最终可到达目标点路径顺序。
    let relation = [];

    //  第一次执行搜索，向待检测队列和关系队列压入起始点
    openList.push(start);
    relation.push({value: start});

    //  递归检测
    function loop() {
        //  如果一直递归到待检测列表为空，说明还没有找到目标点，也就是说：起始点无任何可到达目标点的路径。
        if (openList.length < 1) {
            console.log('搜索结束，无法到达');
            return;
        }
        //  从待检测队列中弹出第一个元素，并将它压入已检测队列
        g = openList.shift();
        closeList.push(g);

        //  获取本次检测点周围可覆盖点（相当于子节点）
        let around = getAround(g, map);

        //  循环所有子节点
        for (let i=0; i<around.length; i++) {
            //  如果当前检测点是目标点，结束递归即可。
            if (g === end) {
                return;
            }
            if (!openList.includes(around[i]) && !closeList.includes(around[i])) {
                //  如果子节点不存在于待检测队列和已检测队列中，将子节点压入待检测队列。通过递归检测，逐层扫描，直到全部路径扫描完。
                openList.push(around[i]);
                //  将扫描过的节点全部存入关系队列中，并标记每个节点的父节点。在需要的时候，可以通过关系队列中逐级找到目标点到起点的路径顺序。
                relation.push({value: around[i], parent: g});
            }
        }
        loop();
    }
    //  执行递归检测
    loop();
    return relation;
}

export default function(start, end, map) {
    let relation = bfs(start, end, map);
    let path = getPath(relation, end);
    path.shift();
    return path;
}