const maps = [
    0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

function getArea(n) {
    if( n % 11 === 0 ) {
        if( n < 11 ) {
            return [n+1, n+11].filter(num => num >= 0 && maps[num] !== 1);
        } else if( n > 109 ) {
            return [n-11, n+1].filter(num => num >= 0 && maps[num] !== 1);
        }
        return [n-11, n+1, n+11].filter(num => num >= 0 && maps[num] !== 1);
    } else if( n % 11 === 10 ) {
        if( n < 11 ) {
            return [n-1, n+11].filter(num => num >= 0 && maps[num] !== 1);
        } else if( n > 109 ) {
            return [n-11, n-1].filter(num => num >= 0 && maps[num] !== 1);
        }
        return [n-1, n-11, n+11].filter(num => num >= 0 && maps[num] !== 1);
    }
    return [n-1, n-11, n+1, n+11].filter(num => num >= 0 && maps[num] !== 1);
}

//  自动寻路
function autoPath(start, end) {
    let openList = [];
    let closeList = [];
    let s = start;
    let g = 0;
    let map = []

    openList.push(s);

    function loop() {
        if( openList.length < 1 ) {
            console.log('搜索结束');
        } else {
            //  未检测待检测坐标
            g = openList.shift();
            closeList.push(g);
            let area = getArea(g);

            for( let i=0; i<area.length; i++ ) {
                if( !openList.includes(area[i]) && !closeList.includes(area[i]) ) {
                    openList.push(area[i]);
                    map.push({value: area[i], parent: g});
                }
                if( g === end ) {
                    return;
                }
            }
            loop();
        }
    }
    loop();
    let path = [];
    let target = end;
    function getPath() {
        for( let i=0; i<map.length; i++ ) {
            if( map[i].value === target ) {
                if( map[i].value === start ) {
                    return;
                } else {
                    if( map[i].value !== end ) {
                        path.unshift(map[i].value);
                    }
                    target = map[i].parent;
                    getPath();
                }
            }
        }
    }
    getPath();
    console.log(path);
}

autoPath(0, 14)