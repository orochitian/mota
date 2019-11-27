import render from './Render'

export default {
    async '01'(game) {
        await render.autoMove(game, 3, 21);
        await render.autoMove(game, 3, 43);
    }
}