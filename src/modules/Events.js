import render from './Render'
import source from './Source'

export default {
    //  自动移动范例
    async 'autoMove'(game) {
        game.pause();
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
    '01'(game) {
        game.pause();
        let list = [
            {
                icon: source.monster33,
                content: '欢迎来到魔塔，你是第一百位挑战者。'
            },
            {
                content: '你将死在这里！'
            },
            {
                icon: source.monster01,
                content: '你说撒呢。。。。'
            }
        ]
        render.dialog(list, async () => {
            game.start();
        });
    }
}