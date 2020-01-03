import player from './Player'
import render from './Render'
import maps from './Maps'

let step = 1;

class Game{
    constructor() {
        //  保存玩家状态
        this.player = player;
        //  游戏运行状态，根据该状态判断游戏主循环是否继续
        this.running = true;
        this.mapIndex = 4;
        this.maps = maps;
        this.requestID = null;
        //  商店购买次数
        this.shopTime = 1;

        //  用来标记触摸位置
        this.clientX = null;
        this.clientY = null;
        //  用来标记是否还在触摸
        this.touching = false;
    }
    //  游戏主循环
    main() {
        window.cancelAnimationFrame(this.requestID);
        if (this.running) {
            if (this.player.moveTo) {
                this.player.move(this, step);
                step++;
                if( step > 16 ) {
                    step = 1;
                }
            }
            this.requestID = window.requestAnimationFrame(this.main.bind(this));
        }
    }
    //  游戏初始化
    init() {
        render.status(this.player);
        render.keys(this.player);
        render.clearMap();
        render.map(this.getMap());
        this.player.render();
        this.start();
    }
    //  开始
    start() {
        this.running = true;
        this.main();
    }
    //  暂停
    pause() {
        this.running = false;
    }
    //  删除地图中的格子
    clear(index) {
        this.getMap().grids[index] = null;
    }
    //  获取指定地图信息
    getMap(index = this.mapIndex) {
        return this.maps[index];
    }
    //  获取指定位置信息
    getGrid(index) {
        return this.getMap().grids[index];
    }
}

export default new Game();