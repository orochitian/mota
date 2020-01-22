import render from './Render'
import source from './Source'

export default {
    //  自动移动示例
    async 'autoMove'(game) {
        await render.autoMove(game, 0, 48);
        await render.autoMove(game, 5, 49);
        await render.autoMove(game, 10, 50);
        await render.autoMove(game, 55, 59);
        await render.autoMove(game, 65, 61);
        await render.autoMove(game, 110, 70);
        await render.autoMove(game, 115, 71);
        await render.autoMove(game, 120, 72);
        game.start();
    },
    //  三层魔王对话，打回2层
    async '01'(game) {
        let list = [
            {
                icon: source.monster33,
                content: '欢迎来到魔塔，你是第一百位挑战者。你若能打败我所有的手下，我就与你一对一的决斗。现在你必须接受我的安排。'
            },
            {
                icon: source.playerIcon,
                content: '什么？'
            }
        ];
        render.staticDraw(source.monster33, 70);
        [91, 81, 103, 93].forEach(item => {
            render.staticDraw(source.monster31, item);
        });
        await render.staticShow();
        await render.dialog(list);
        game.clear(92);
        render.staticDraw(source.attack, game.player.index);
        await render.staticHide();
        render.black();
        game.mapIndex = 2;
        game.player.set({index: 79, direct: 'up', hp: 400, attack: 200, defense: 200});
        render.status(game.player);
        game.init();
        game.pause();
        await render.dialog([
            {icon: source.thief, content: '。。。。。'},
            {icon: source.thief, content: '喂。。。'},
            {icon: source.thief, content: '喂。。。，醒醒'}
        ]);
        render.staticClear();
        await render.dialog([
            {icon: source.thief, content: '你清醒了吗？你到监狱时还处于昏迷中，魔法警卫把你扔到我这个房间，但你很幸运，我刚完成逃跑的暗道，我们一起越狱吧。'},
            {icon: source.thief, content: '你的剑和盾被警卫拿走了，你必须先找到武器，我知道铁剑在5楼，铁盾在9楼，你最好先取到它们。我现在有事要做没法帮你，再见。'}
        ]);
        game.clear(67);
        render.clearGrid(67);
        await render.autoMove(game, 68, 99);
        game.clear(99);
        render.clearGrid(99);
        game.start();
    },
    async '02'(game) {
        await render.dialog([
            {icon: source.wise, content: '我可以给你怪物手册，它可以预测出当前楼层各类怪物对你的伤害'}
        ]);
        await render.openGrid(43);
        game.player.items.monsterMenu = 1;
        render.msg('获得怪物图鉴');
    },
    //  四层贤者对话
    async '0401'(game) {
        await render.dialog([
            {icon: source.wise, content: '有些门不能用钥匙打开，只有当你打败它的守卫后才会自动打开。'}
        ]);
        render.openGrid(9);
    },
    //  6层贤者对话
    async '0601'(game) {
        await render.dialog([
            {icon: source.wise, content: '你购买了礼物后再与商人对话，他会告诉你一些重要的消息。'}
        ]);
        render.openGrid(80);
    },
    //  6层商人对话
    async '0602'(game) {
        render.buy({
            game,
            index: 40,
            content: '我有一把蓝钥匙，你出50个金币就卖给你。',
            price: 50,
            name: 'bluekey',
            num: 1
        });
    },
    //  7层商人对话
    async '0701'(game) {
        render.buy({
            game,
            index: 5,
            content: '我有五把黄钥匙，你出50个金币就卖给你。',
            price: 50,
            name: 'yellowkey',
            num: 5
        });
    },
    // 10层遇到BOSS对话
    async '1001'(game) {
        game.pause();
        //  删除当前位置事件
        game.clear(49);
        //  对话
        await render.dialog([
            {icon: source.monster08, content: '哈哈哈，你是如此的幸运能安全到达这里，但现在好运离你而去了，你中埋伏了，弟兄们给我上。'}
        ]);
        //  队长移动
        await render.autoMove(game, 38, 5);

        //  开门和墙，由于openGate和openGrid执行完成后默认会执行game.start()所以这里要手动暂停一下
        await render.openGate('greengate', [36, 40], game);
        game.pause();

        await render.openGrid(game, [59, 61]);
        game.pause();

        let paths = [ [34, 60], [22, 59], [23, 48], [24, 37], [42, 38], [30, 61], [31, 50], [32, 39] ];
        for( let i=0; i<paths.length; i++ ) {
            await render.autoMove(game, paths[i][0], paths[i][1]);
        }
        [27, 36, 40, 71].forEach(item => {
            game.getMap().grids[item] = {type: 'build', name: 'greengate'};
            render.draw(source.greengate, item);
        });
        game.start();
    },
    async '1002'(game) {
        game.pause();
        //  删除当前位置事件
        game.clear(16);
        //  对话
        await render.dialog([
            {icon: source.monster08, content: '你怎么可能杀出重围？我是绝对不会让你通过的，来吧，我要和你决斗！奥利给！'}
        ]);
        game.start();
    },
    async '1003'(game) {
        game.pause();
        //  对话
        await render.dialog([
            {icon: source.monster08, content: '不，这是不可能的，你怎么会打败我！你别太得意，后面还有许多强大的对手和机关存在，你稍有疏忽就必死无疑。'}
        ]);
        let map = [
            {type: 'item', name: 'attackgem', index: 22},
            {type: 'item', name: 'attackgem', index: 23},
            {type: 'item', name: 'attackgem', index: 24},
            {type: 'item', name: 'defencegem', index: 30},
            {type: 'item', name: 'defencegem', index: 31},
            {type: 'item', name: 'defencegem', index: 32},
            {type: 'item', name: 'hplarge', index: 33},
            {type: 'item', name: 'hplarge', index: 34},
            {type: 'item', name: 'hplarge', index: 35},
            {type: 'item', name: 'yellowkey', index: 41},
            {type: 'item', name: 'yellowkey', index: 42},
            {type: 'item', name: 'yellowkey', index: 43},
        ];

        map.forEach(item => {
            render.draw(source[item.name], item.index);
            game.getMap().grids[item.index] = {type: item.type, name: item.name};
        });
        game.getMap().grids[93] = {type: 'event', event: '1004'};
        game.getMap().grids[115] = {type: 'build', name: 'up'};
        render.draw(source.up, 115);
        await render.openGate('greengate', [36, 40, 71], game);
    },
    async '1004'(game) {
        game.pause();
        render.draw(source.thief, 104);
        //  对话
        await render.dialog([
            {icon: source.thief, content: '嘿嘿，我们又见面了，非常感谢你打败了此区域的头目。'},
            {icon: source.thief, content: '我正苦恼于如何到更高的楼层，现在我终于可以上去了。我听说银盾在11楼，银剑在17楼，这消息不知道对你是否有用。'},
        ]);
        render.clearGrid(104);
        game.clear(93);
        game.start();
    }
}