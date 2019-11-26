import render from './Render'

export default {
    '01'(game) {
        let player = game.player;
        let map = game.getMap();
        let grid = game.getGrid(3);
        render.autoMove(map.grids, grid, 3, 43);
    }
}