import {ctx, StaticCtx, ActiveCtx, grid} from './Global'
import source from './Source'
import findPath from './FindPath'

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
    duration: 1000
});
messageAnimation.cancel();

let oStatic = document.getElementById('static');

export default {
    //  渲染地图
    map(map) {
        for( let i=0; i<map.grids.length; i++ ) {
            if( !map.grids[i] || map.grids[i].type === 'event' ) {
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
    //  自动寻路
    autoMove(game, start, end) {
        let map = game.getMap();
        let obj = game.getGrid(start);
        if( !obj ) return;

        let path = findPath(start, end, map.grids);
        let begin = start;

        return new Promise(resolve => {
            function loop() {
                let next = path.shift();
                let direction = null;
                if( !next ) {
                    game.clear(start);
                    map.grids[end] = obj;
                    resolve();
                    return;
                }
                if( begin - 1 === next ) {
                    direction = 'left';
                } else if( begin + 1 === next ) {
                    direction = 'right';
                } else if( begin - 11 === next ) {
                    direction = 'up';
                } else if( begin + 11 === next ) {
                    direction = 'down';
                }
                let x = grid[begin][0];
                let y = grid[begin][1];

                function frame() {
                    switch (direction) {
                        case 'left':
                            ctx.clearRect(x, y, 32, 32);
                            x -= 2;
                            ctx.drawImage(source[obj.name], x, y, 32, 32);
                            break
                        case 'right':
                            ctx.clearRect(x, y, 32, 32);
                            x += 2;
                            ctx.drawImage(source[obj.name], x, y, 32, 32);
                            break
                        case 'up':
                            ctx.clearRect(x, y, 32, 32);
                            y -= 2;
                            ctx.drawImage(source[obj.name], x, y, 32, 32);
                            break
                        case 'down':
                            ctx.clearRect(x, y, 32, 32);
                            y += 2;
                            ctx.drawImage(source[obj.name], x, y, 32, 32);
                            break
                    }
                    if( x === grid[next][0] && y === grid[next][1] ) {
                        begin = next;
                        loop();
                    } else {
                        requestAnimationFrame(frame);
                    }
                }
                frame();
            }
            loop();
        })
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
    //  消息
    msg(msg) {
        oMessage.innerText = msg;
        messageAnimation.cancel();
        messageAnimation.play();
    },
    //  对话
    dialog(list) {
        return new Promise(resolve => {
            //  对话层dom
            let oDialog = document.getElementById('dialog');
            let animation = null;
            let index = 0;
            let listArr = [];
            let dialogList = document.getElementById('dialog-list');
            dialogList.innerHTML = '';
            document.getElementById('dialog-icon').src = list[index].icon.src;
            list.forEach((li, index) => {
                let oli = document.createElement('li');
                oli.className = 'dialog-li';
                oli.innerHTML = li.content;
                dialogList.appendChild(oli);
                listArr.push(oli);
            });
            oDialog.style.visibility = 'visible';
            oDialog.onclick = () => {
                if( animation && animation.playState !== 'finished' ) return;
                index++;
                if( index < list.length ) {
                    if( list[index].icon ) {
                        document.getElementById('dialog-icon').src = list[index].icon.src;
                    }
                    listArr[index-1].style.visibility = 'hidden';
                    animation = listArr[index].animate([{opacity: 0}, {opacity: 1}], {duration: 800, fill: 'forwards'});
                } else {
                    oDialog.style.visibility = 'hidden';
                    resolve();
                }
            }
        });
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
    status(player) {
        document.querySelector('.hp-value').innerHTML = player.hp;
        document.querySelector('.attack-value').innerHTML = player.attack;
        document.querySelector('.defense-value').innerHTML = player.defense;
        document.querySelector('.money-value').innerHTML = player.money;
    },
    //  清除画布
    staticClear() {
        StaticCtx.clearRect(0, 0, 352, 352);
    },
    staticDraw(src, index) {
        let x = grid[index][0];
        let y = grid[index][1];
        StaticCtx.drawImage(src, 0, 0, 32, 32, x, y, 32, 32);
    },
    black() {
        StaticCtx.save();
        StaticCtx.fillStyle = '#000';
        StaticCtx.fillRect(0, 0, 352, 352);
        StaticCtx.restore();
    },
    staticShow() {
        return new Promise(resolve => {
            let animation = oStatic.animate([
                {opacity: 0},
                {opacity: 1}
            ], {
                duration: 1000,
                fill: 'forwards'
            });
            animation.onfinish = () => {
                resolve();
            }
        });

    },
    staticHide() {
        return new Promise(resolve => {
            let animation = oStatic.animate([
                {opacity: 1},
                {opacity: 0}
            ], {
                duration: 1000
            });
            animation.onfinish = () => {
                this.staticClear();
                resolve();
            }
        })
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
    },
}