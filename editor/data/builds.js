window.builds = [
    //  墙
    {
        name: 'wall',
    },
    //  空气墙，可消除
    {
        name: 'airWall',
    },
    //  黄门
    {
        name: 'yellowgate',
    },
    //  蓝门
    {
        name: 'bluegate',
    },
    //  红门
    {
        name: 'redgate',
    },
    //  绿门
    {
        name: 'greengate',
    },
    //  铁栏杆
    {
        name: 'rail',
    },
    //  下楼楼梯
    {
        name: 'down',
    },
    //  上楼楼梯
    {
        name: 'up',
    },
    //  商店左
    {
        name: 'shopLeft',
    },
    //  商店中
    {
        name: 'shopCenter',
    },
    //  商店右
    {
        name: 'shopRight',
    },
];

window.builds = window.builds.map(item => {
    item.type = 'build';
    item.active = false;
    item.src = './images/builds/' + item.name + '.png'
    return item;
});