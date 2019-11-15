import './style.css'
import game from './modules/Game'
import './modules/Controller'

window.onload = () => {
    game.init();

    //  刷新
    document.getElementById('refresh').onclick = () => {
        window.location.reload();
    }
    //  存档
    document.getElementById('save').onclick = () => {
        let save = {
            player: game.player,
            maps: game.maps,
            mapIndex: game.mapIndex
        }
        localStorage.setItem('mota-save', JSON.stringify(save));
    }
    //  读档
    document.getElementById('load').onclick = () => {
        let save = JSON.parse(localStorage.getItem('mota-save'));
        Object.assign(game.player, save.player);
        game.maps = save.maps;
        game.mapIndex = save.mapIndex;
        game.init();
    }
}




