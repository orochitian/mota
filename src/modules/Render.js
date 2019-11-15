import {ctx, StaticCtx, ActiveCtx, grid} from './Global'
import source from './Source'

let running = false;

//  消息层dom
let oMessage = document.getElementById('message');
let messageAnimation = oMessage.animate([
    {opacity: 0},
    {opacity: 1},
    {opacity: 1},
    {opacity: 1},
    {opacity: 0}
], {
    duration: 1500
});
messageAnimation.cancel();


export default {
    //  渲染地图
    map(map) {
        for( let i=0; i<map.grids.length; i++ ) {
            if( !map.grids[i] ) {
                continue;
            } else {
                this.draw(source[map.grids[i].name], i);
            }
        }
    },
    //  清除画布
    clearMap() {
        ctx.clearRect(0, 0, 352, 352);
    },
    draw(src, index) {
        let x = grid[index][0];
        let y = grid[index][1];
        ctx.drawImage(src, 0, 0, 32, 32, x, y, 32, 32);
    },
    //  4步缓动
    tween(handle, callback) {
        let step = 1;
        let timmer = null;
        timmer = setInterval(() => {
            if( step > 4 ) {
                clearInterval(timmer);
                callback();
            } else {
                handle(step);
            }
            step++;
        }, 50);
    },
    //  清除格子，直接删除块
    clearGrid(index) {
        ctx.clearRect(grid[index][0], grid[index][1], 32, 32);
    },
    //  清除格子，从上到下消除
    openGrid(index, callback) {
        if( typeof index === 'number' ) {
            this.tween(step => {
                ctx.clearRect(grid[index][0], grid[index][1], 32, 8 * step);
            }, callback);
        } else {
            this.tween(step => {
                for( let i=0; i<index.length; i++ ) {
                    ctx.clearRect(grid[index[i]][0], grid[index[i]][1], 32, 8 * step);
                }
            }, callback);
        }
    },
    //  开门
    openGate(name, index, game) {
        game.pause();
        if( typeof index === 'number' ) {
            this.tween(step => {
                this.clearGrid(index);
                ctx.drawImage(source[name], 0, step*32, 32, 32, grid[index][0], grid[index][1], 32, 32);
            }, () => {
                game.clear(index);
                game.start();
                game.player.keepMove(game);
            });
        } else {
            this.tween(step => {
                for( let i=0; i<index.length; i++ ) {
                    this.clearGrid(index[i]);
                    ctx.drawImage(source[name], 0, step*32, 32, 32, grid[index[i]][0], grid[index[i]][1], 32, 32);
                }
            }, () => {
                game.clear(index);
                game.start();
                game.player.keepMove(game);
            });
        }
    },
    msg(msg) {
        oMessage.innerText = msg;
        messageAnimation.cancel();
        messageAnimation.play();
    },
    //  暗雷伤害
    hurt(game) {
        let alpha = 0.1;
        StaticCtx.save();
        StaticCtx.globalAlpha = 0;
        StaticCtx.fillStyle = 'red';
        game.pause();
        game.player.isMove = false;
        game.player.turn = false;
        running = true;
        this.fram(() => {
            if( StaticCtx.globalAlpha > 0.9 ) {
                alpha = -0.1;
            }
            StaticCtx.clearRect(0, 0, 352, 352);
            StaticCtx.globalAlpha += alpha;
            StaticCtx.fillRect(0, 0, 352, 352);
            if( StaticCtx.globalAlpha < 0.1 ) {
                running = false;
                game.start();
                game.player.keepMove(game);
                StaticCtx.restore();
            }
        });
    },
    fram(callback) {
        //  在调用fram的回调中决定何时停止循环，即何时设置running为false
        if( running ) {
            callback();
            window.requestAnimationFrame(this.fram.bind(this, callback));
        }
    },
    //  场景切换
    changeScene(game, callback) {
        //  callback 是场景切换到一半时执行的。
        let speed = 8;
        let up = -352;
        let down = 352;
        StaticCtx.save();
        StaticCtx.fillStyle = '#000';
        running = true;
        game.pause();
        this.fram(() => {
            StaticCtx.clearRect(0, 0, 352, 352);
            up += speed;
            down -= speed;
            StaticCtx.fillRect(0, up, 352, 352);
            StaticCtx.fillRect(0, down, 352, 352);
            if( up >= 0 ) {
                speed = -speed;
                callback();
            }
            if( up <= -352 ) {
                running = false;
                game.start();
                StaticCtx.restore();
            }
        });
    },
    //  开始战斗
    fightStart(hero, monster) {
        StaticCtx.save();
        //  1、半透明背景
        StaticCtx.fillStyle = 'rgba(0,0,0,.5)';
        StaticCtx.fillRect(0, 0, 352, 352);
        //  2、画战斗背景方框
        StaticCtx.lineWidth = 4;
        StaticCtx.beginPath();
        StaticCtx.moveTo(8, 108);
        StaticCtx.lineTo(344, 108);
        StaticCtx.lineTo(344, 253);
        StaticCtx.lineTo(8, 253);
        StaticCtx.closePath();
        //  3、描边并填充颜色
        StaticCtx.strokeStyle = '#fff';
        const battleBg = StaticCtx.createPattern(source.battle, null);
        StaticCtx.fillStyle = battleBg;
        StaticCtx.stroke();
        StaticCtx.fill();

        //  角色、怪物、VS 图标
        StaticCtx.globalAlpha = 0.8;
        StaticCtx.drawImage(source[monster.img], 46, 195, 40, 40);
        StaticCtx.drawImage(source.player, 0, 0, 32, 32, 267, 195, 40, 40);
        StaticCtx.drawImage(source.vs, 145, 160);
        StaticCtx.fillStyle = '#fff';
        StaticCtx.fillText('生命值 :', 46, 135);
        StaticCtx.fillText('攻击力 : ' + monster.attack, 46, 155);
        StaticCtx.fillText('防御力 : ' + monster.defense, 46, 175);
        StaticCtx.textAlign = 'end';
        StaticCtx.fillText(': 生命值', 307, 135);
        StaticCtx.fillText(hero.attack + ' : 攻击力', 307, 155);
        StaticCtx.fillText(hero.defense + ' : 防御力', 307, 175);
        StaticCtx.restore();
    },
    //  战斗中
    fighting(heroHp, monsterHp) {
        ActiveCtx.clearRect(80, 115, 192, 30);
        ActiveCtx.save();
        ActiveCtx.globalAlpha = 0.8;
        ActiveCtx.fillStyle = 'orange';
        ActiveCtx.fillText(monsterHp, 83, 135);
        ActiveCtx.textAlign = 'end';
        ActiveCtx.fillText(heroHp, 269, 135);
        ActiveCtx.restore();
    },
    //  战斗结束
    fightEnd() {
        StaticCtx.clearRect(0, 0, 352, 352);
        ActiveCtx.clearRect(0, 0, 352, 352);
    }
}