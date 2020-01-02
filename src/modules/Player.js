import {ctx, grid} from "./Global";
import render from './Render'
import monsters from './Monsters'
import events from './Events'
import {player} from './Source'

let imgPos = 0;
//  角色移动图片定位
let xPos = 0;


class Player{
    constructor() {
        this.index = 58;
        this.position = [grid[this.index][0], grid[this.index][1]];
        //  角色当前移动方向
        this.direction = null;
        //  角色移动目标
        this.moveTo = null;
        this.target = null;
        //  是否可以移动
        this.canMove = true;
        //  判断角色是否持续移动中
        this.isMove = false;
        //  判断角色是否在转向
        this.turn = null;
        this.hp = 1000;
        this.attack = 10;
        this.defense = 100;
        this.money = 0;
        this.items = {
            yellowkey: 0,
            bluekey: 0,
            redkey: 0,
            monsterMenu: 0,
            chuansong: 0
        }
    }
    set(option) {
        Object.assign(this, option);
        if( option.items ) {
            Object.assign(this.items, option.items);
        }
        if( option.index ) {
            this.position = [grid[option.index][0], grid[option.index][1]];
        }
        if( option.direct ) {
            switch (option.direct) {
                case 'up':
                    imgPos = 96;
                    break;
                case 'down':
                    imgPos = 0;
                    break;
                case 'left':
                    imgPos = 32;
                    break;
                case 'right':
                    imgPos = 64;
                    break;
            }
        }
    }
    render(step) {
        if( !step ) {
            ctx.drawImage(player, 0, imgPos, 32, 32, this.position[0], this.position[1], 32, 32);
            return;
        }
        if( step % 4 === 0 ) {
            xPos = (step / 4 - 1) * 32;
        }
        ctx.drawImage(player, xPos, imgPos, 32, 32, this.position[0], this.position[1], 32, 32);
    }
    //  继续移动
    keepMove(game) {
        if( game.touching ) {
            let event = new TouchEvent('touchstart', {
                touches: [new Touch({
                    identifier: 0,
                    target: document.getElementById('control'),
                    clientX: game.clientX,
                    clientY: game.clientY
                })]
            });
            document.getElementById('control').dispatchEvent(event);
        }
    }
    //  开始移动
    startMove(direction, game) {
        if( this.moveTo ) {
            if( this.direction !== direction ) {
                this.turn = direction;
            }
            return;
        }
        let indexCache = this.index;
        this.isMove = true;
        this.direction = direction;
        switch (direction) {
            case 'up':
                imgPos = 96;
                indexCache -= 11;
                this.target = [this.position[0], this.position[1] - 32];
                break;
            case 'down':
                imgPos = 0;
                indexCache += 11;
                this.target = [this.position[0], this.position[1] + 32];
                break;
            case 'left':
                imgPos = 32;
                if( this.index % 11 === 0 ) {
                    indexCache = -1;
                    break;
                }
                indexCache--;
                this.target = [this.position[0] - 32, this.position[1]];
                break;
            case 'right':
                imgPos = 64;
                if( this.index % 11 === 10 ) {
                    indexCache = -1;
                    break;
                }
                indexCache++;
                this.target = [this.position[0] + 32, this.position[1]];
                break;
        }
        this.direction = direction;
        this.trigger(game, indexCache);
        if( !this.canMove ) {
            ctx.clearRect(this.position[0], this.position[1], 32, 32);
            this.render();
            this.moveTo = null;
            this.turn = null;
        } else {
            this.index = indexCache;
            this.moveTo = direction;
        }
    }
    //  移动
    move(game, step) {
        ctx.clearRect(this.position[0], this.position[1], 32, 32);
        switch (this.direction) {
            case 'up':
                this.position[1] -= 2;
                break;
            case 'down':
                this.position[1] += 2;
                break;
            case 'left':
                this.position[0] -= 2;
                break;
            case 'right':
                this.position[0] += 2;
                break;
        }
        this.render(step);
        if( this.position.toString() === this.target.toString() ) {
            this.getHurt(game, this.index);
            this.stopMove();
            let grid = game.getGrid(this.index);
            //  事件需要移动完成之后触发，需要移动完成后触发的都可以写在这里
            if( grid && grid.type === 'event' ) {
                game.touching = false;
                this.isMove = false;
                this.turn = null;
                game.pause();
                events[grid.name](game);
            }
            if( this.isMove ) {
                this.startMove(this.direction, game);
            } else if( this.turn ) {
                this.startMove(this.turn, game);
            }
        }
    }
    //  转向
    turnTo(direction) {
        this.isMove = false;
        this.turn = direction;
    }
    stopMove() {
        this.moveTo = null;
    }
    getItem(game, index) {
        let map = game.getMap();
        let item = map.grids[index];
        game.clear(index);
        render.clearGrid(index);
        if( /^yellowkey|bluekey|redkey$/.test(item.name) ) {
            document.getElementById(item.name + '-num').innerHTML = ++this.items[item.name];
        } else if( item.name === 'hp' ) {
            this.hp += 50 * map.area;
            render.status(this, 'hp');
        } else if( item.name === 'hplarge' ) {
            this.hp += 200 * map.area;
            render.status(this, 'hp');
        } else if( item.name === 'attackgem' ) {
            this.attack += map.area;
            render.status(this, 'attack');
        } else if( item.name === 'defencegem' ) {
            this.defense += map.area;
            render.status(this, 'defense');
        }
    }
    getBuild(game, index) {
        let current = game.getGrid(index);
        let name = current.name;
        if( name === 'yellowgate' ) {
            if( this.items.yellowkey > 0 ) {
                document.getElementById('yellowkey-num').innerHTML = --this.items.yellowkey;
                render.openGate(name, index, game);
            } else {
                render.msg('没有黄色钥匙');
            }
        } else if( name === 'bluegate' ) {
            if( this.items.bluekey > 0 ) {
                document.getElementById('bluekey-num').innerHTML = --this.items.bluekey;
                render.openGate(name, index, game);
            } else {
                render.msg('没有蓝色钥匙');
            }
        } else if( name === 'redgate' ) {
            if( this.items.redkey > 0 ) {
                document.getElementById('redkey-num').innerHTML = --this.items.redkey;
                render.openGate(name, index, game);
            } else {
                render.msg('没有红色钥匙');
            }
        } else if( name === 'down' || name === 'up' ) {
            render.changeScene(game, () => {
                //  改变楼层
                name === 'down' ? --game.mapIndex : ++game.mapIndex;
                //  改变角色坐标为楼层初始错标，分上或下
                this.index = game.getMap()[name];
                //  修改角色渲染位置
                this.position = [grid[this.index][0], grid[this.index][1]];
                //  重置角色面对的方向，面向屏幕，后期也可以修改
                imgPos = 0;
                //  在场景过度到一半的时候重新渲染新地图，同时暂停游戏
                game.init();
                game.pause();
            });
        }
    }
    fight(game, index) {
        let hero = this;
        var map = game.getMap();
        var next = map.grids[index];
        var monster = monsters[next.name];
        var heroDamage = hero.attack - monster.defense < 0 ? 0 : hero.attack - monster.defense;
        var monsterDamage = monster.attack - hero.defense < 0 ? 0 : monster.attack - hero.defense;
        if( heroDamage === 0 ) {
            render.msg('无法破防，打不过');
            return false;
        }
        var heroHitTimes = Math.ceil(monster.hp / heroDamage);
        var monsterHitTimes = Math.ceil(hero.hp / monsterDamage);
        if( heroHitTimes > monsterHitTimes ) {
            render.msg('血量不够，打不过');
            return false;
        }
        var timmer = null;
        var times = 0;
        var monsterHp = monster.hp;
        var heroHp = hero.hp;
        game.pause();
        render.fightStart(hero, monster);
        render.fighting(heroHp, monsterHp);
        timmer = setInterval(function () {
            times++;
            monsterHp -= heroDamage;
            monsterHp < 0 ? monsterHp = 0 : '';
            if( monsterDamage > 0 ) {
                heroHp -= monsterDamage;
            }
            render.fighting(heroHp, monsterHp);
            if( times === heroHitTimes ) {
                render.msg('战斗胜利，获得' + monster.money + '金币');

                clearInterval(timmer);
                render.fightEnd();
                render.status(hero);
                render.openGrid(index, () => {
                    game.clear(index);
                    if( next.open ) {
                        let killed = true;
                        for( let i=0, monsters = next.open.monsters; i<monsters.length; i++  ) {
                            if( game.getGrid(monsters[i]) !== null ) {
                                killed = false;
                                break;
                            }
                        }
                        if( killed ) {
                            next.open.gates.forEach(i => {
                                game.clear(i);
                            });
                            if( next.open.type === 'rail' ) {
                                render.openGrid(next.open.gates, () => {
                                    game.start();
                                });
                            } else {
                                render.openGate(next.open.type, next.open.gates, game);
                            }
                        } else {
                            game.start();
                        }
                    } else if( next.event ) {
                        //  停止继续移动
                        game.touching = false;
                        hero.isMove = false;
                        events[next.event](game);
                    } else {
                        game.start();
                    }
                });
            }
        }, 500);
        hero.hp -= monsterDamage*(heroHitTimes-1);
        hero.money += monster.money;
    }
    trigger(game, index) {
        let grid = game.getGrid(index);
        if( grid === undefined ) {
            this.canMove = false;
        } else if( grid === null ) {
            this.canMove = true;
        } else if( grid.type === 'event' ) {
            this.canMove = true;
        } else if( grid.name === 'wall' ) {
            this.canMove = false;
        } else if( grid.type === 'npc' ) {
            this.canMove = false;
            game.pause();
            events[grid.event](game);
        } else if( grid.type === 'item' ) {
            this.getItem(game, index);
            this.canMove = true;
        } else if( grid.type === 'build' ) {
            this.getBuild(game, index);
            this.canMove = false;
        } else if( grid.type === 'monster' ) {
            this.fight(game, index);
            this.canMove = false;
        }
    }
    //  判断是否有暗雷触发
    getHurt(game, index) {
        let area = [];
        let guard = 0;
        index % 11 === 0 ? '' : area.push(game.getGrid(index-1));
        index % 11 === 10 ? '' : area.push(game.getGrid(index+1));
        index < 11 ? '' : area.push(game.getGrid(index-11));
        index > 109 ? '' : area.push(game.getGrid(index+11));
        for( let i=0; i<area.length; i++ ) {
            if( !area[i] ) continue;
            //  如果是守卫
            if( area[i].name === 'monster31' ) {
                guard++;
            } else if( area[i].name === 'monster27' ) {
                console.log('收到200点暴击');
                game.player.hp <= 200 ? game.player.hp = 1 : game.player.hp -= 200;
                render.hurt(game);
                render.status(this, 'hp');
                return;
            }
        }
        if( guard > 1 ) {
            render.hurt(game);
            game.player.hp = Math.ceil(game.player.hp / 2);
            console.log('hp减少50%');
            render.status(this, 'hp');
        }
    }
}

export default new Player();