const map = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
        return [n-11, n+1, n+11].filter(num => num >= 0);
    } else if( n % 11 === 10 ) {
        return [n-1, n-11, n+11].filter(num => num >= 0);
    }
    return [n-1, n-11, n+1, n+11].filter(num => num >= 0);
}

//  自动寻路
function autoPath(start, end) {
    let openList = [];
    let closeList = [];
    let s = start;
    let g = 0;
    let path = [[s, 1], [s, 11]];

    openList.push(s);

    function loop() {
        if( openList.length < 1 ) {
            console.log('搜索结束');
        } else {
            g = openList.shift();
            let area = getArea(g);

            for( let i=0; i<area.length; i++ ) {
                //  判断当前坐标的四周是否被检测过，没有检测过的加入待检测列表
                if( area[i] === end ) {
                    return;
                }
                if( !openList.includes(area[i]) && !closeList.includes(area[i]) ) {
                    for( let j=0; j<path.length; j++ ) {
                        if( path[j].includes(g) ) {
                            path[j].push(area[i]);
                        }
                    }
                    openList.push(area[i]);
                }
            }
            //  将当前坐标加入已检测列表
            closeList.push(g);
            loop();
        }
    }
    loop();
    console.log(path);
}

autoPath(0, 5)