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
        game.player.set({index: 79, direct: 'up', hp: 400, attack: 10, defense: 10});
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
        game.clear(43);
        render.openGrid(43, () => {
            game.player.items.monsterMenu = 1;
            render.msg('获得怪物图鉴');
            game.start();
        });
    }
}