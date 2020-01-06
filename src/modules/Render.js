import {ctx, StaticCtx, ActiveCtx, grid} from './Global'
import source from './Source'
import findPath from './FindPath'
import monsters from './Monsters'

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
    duration: 1000,
    ease: 'easing-out'
});
messageAnimation.cancel();

let oStatic = document.getElementById('static');

export default {
    //  渲染地图
    map(game) {
        let map = game.getMap();
        document.getElementById('floor-num').innerHTML = `第${game.mapIndex}层`;
        for( let i=0; i<map.grids.length; i++ ) {
            if( !map.grids[i] || map.grids[i].type === 'event' ) {
                continue;
            } else if( map.grids[i].area ) {
                if( map.grids[i].big ) {
                    let x = grid[i-23][0];
                    let y = grid[i-23][1];
                    ctx.drawImage(source[map.grids[i].name], 0, 0, 96, 96, x, y, 96, 96);
                }
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
            oDialog.ontouchend = ev => {
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
                StaticCtx.restore();
                game.start();
                game.player.keepMove(game);
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
    //  渲染钥匙
    keys(player, filter) {
        if( !filter ) {
            document.getElementById('yellowkey-num').innerHTML = player.items.yellowkey;
            document.getElementById('bluekey-num').innerHTML = player.items.bluekey;
            document.getElementById('redkey-num').innerHTML = player.items.redkey;
        } else {
            document.getElementById(filter + '-num').innerHTML = player.items[filter];
        }
    },
    //  渲染角色数据显示
    status(player, filter) {
        if( !filter ) {
            document.querySelector('.hp-value').innerHTML = player.hp;
            document.querySelector('.attack-value').innerHTML = player.attack;
            document.querySelector('.defense-value').innerHTML = player.defense;
            document.querySelector('.money-value').innerHTML = player.money;
        } else {
            document.querySelector('.'+filter+'-value').innerHTML = player[filter];
        }

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
    //  黑屏
    black() {
        StaticCtx.save();
        StaticCtx.fillStyle = '#000';
        StaticCtx.fillRect(0, 0, 352, 352);
        StaticCtx.restore();
    },
    //  全屏遮罩显示
    maskShow() {
        document.getElementById('mask').style.visibility = 'visible';
    },
    //  全屏遮罩隐藏
    maskHide() {
        document.getElementById('mask').style.visibility = 'hidden';
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
        this.maskShow();
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
        this.maskHide();
        StaticCtx.clearRect(0, 0, 352, 352);
        ActiveCtx.clearRect(0, 0, 352, 352);
    },
    //  怪物图鉴列表
    monsterList(game) {
        let oList = document.getElementById('monster-list');
        oList.innerHTML = '';
        let monsterList = new Set(game.getMap().grids.filter(item => item && item.type === 'monster').map(item => item.name));
        monsterList.forEach(item => {
            let lost;
            let hero = game.player;
            let monster = monsters[item];
            let heroDamage = hero.attack - monster.defense < 0 ? 0 : hero.attack - monster.defense;
            let monsterDamage = monster.attack - hero.defense < 0 ? 0 : monster.attack - hero.defense;
            let heroHitTimes = Math.ceil(monster.hp / heroDamage);
            let monsterHitTimes = Math.ceil(hero.hp / monsterDamage);
            if( heroDamage === 0 ) {
                lost = '打不过';
            } else if( heroHitTimes > monsterHitTimes ) {
                lost = monsterDamage*(heroHitTimes-1) + '(打不过)';
            } else {
                lost = monsterDamage*(heroHitTimes-1);
            }

            let row = document.createElement('div');
            row.className = 'monster-row';
            row.innerHTML = `
                <div class="left">
                    <div class="icon"><img src="${source[monster.img].src}" /></div>
                    <div class="name">${monster.name}</div>
                </div>
                <div class="right">
                    <div class="top">
                        <p><img src="${source.hp.src}" /> <span>${monster.hp}</span></p>
                        <p><img src="${source.tiejian.src}" /> <span>${monster.attack}</span></p>
                        <p><img src="${source.tiedun.src}" /> <span>${monster.defense}</span></p>
                    </div>
                    <div class="bottom">
                        <p><img src="${source.luckycoins.src}" /> <span>${monster.money}</span></p>
                        <p style="width: auto;"><img src="${source.fightLost.src}" /> <span>${lost}</span></p>
                    </div>
                </div>
            `;
            oList.append(row);
        });
    },
    //  商店
    shop(game) {
        game.pause();
        this.maskShow();
        let shop = document.getElementById('shop');
        let shopCost = document.getElementById('shop-cost');
        let hpBtn = document.getElementById('add-hp');
        let attackBtn = document.getElementById('add-attack');
        let defenseBtn = document.getElementById('add-defense');

        let price = 10 * game.shopTime * (game.shopTime-1) + 20;
        let hpNum = game.shopTime * 100;
        let attackNum = 2 * game.getMap().area;
        let defenseNum = 4 * game.getMap().area;

        shopCost.innerHTML = `花费${price}金币您可以：`;
        hpBtn.innerHTML = `增加${hpNum}点生命`;
        attackBtn.innerHTML = `增加${attackNum}点攻击`;
        defenseBtn.innerHTML = `增加${defenseNum}点防御`;

        let buy = () => {
            game.shopTime++;
            game.player.money -= price;
            price = 10 * game.shopTime * (game.shopTime-1) + 20;
            hpNum = game.shopTime*100;
            shopCost.innerHTML = `花费${price}金币您可以：`;
            hpBtn.innerHTML = `增加${hpNum}点生命`;
            this.status(game.player);
        }

        hpBtn.onclick = function () {
            if( game.player.money >= price ) {
                game.player.hp += hpNum;
                buy();
            }
        }
        attackBtn.onclick = function () {
            if( game.player.money >= price ) {
                game.player.attack += attackNum;
                buy();
            }
        }
        defenseBtn.onclick = function () {
            if( game.player.money >= price ) {
                game.player.defense += defenseNum;
                buy();
            }
        }
        document.getElementById('close-shop').onclick = () => {
            shop.style.visibility = 'hidden';
            this.maskHide();
            game.start();
        }
        shop.style.visibility = 'visible';
    },
    //  传送
    chuansong(game) {
        if( !game.player.items.chuansong ) {
            this.msg('没有传送权杖');
        } else {
            if( game.getMap().csPos.includes(game.player.index) ) {
                document.getElementById('floor-list').innerHTML = '';
                for( let i=0; i<game.floors.length; i++ ) {
                    let li = document.createElement('li');
                    li.innerHTML = game.floors[i];
                    if( game.floors[i] === game.mapIndex ) {
                        li.className = 'active';
                    }
                    document.getElementById('floor-list').append(li);
                    li.onclick = ev => {
                        if( game.floors[i] === game.mapIndex ) {
                            return false;
                        }
                        document.getElementById('floor').style.visibility = 'hidden';
                        this.changeScene(game, () => {
                            let name = '';
                            if( game.mapIndex < game.floors[i] ) {
                                name = 'up';
                            } else {
                                name = 'down';
                            }
                            game.mapIndex = game.floors[i];
                            game.player.set({index: game.getMap()[name]});
                            //  在场景过度到一半的时候重新渲染新地图，同时暂停游戏
                            game.init();
                        });
                    }
                }
                document.getElementById('floor').style.visibility = 'visible';
            } else {
                this.msg('只能在楼梯旁使用');
            }
        }
    }
}