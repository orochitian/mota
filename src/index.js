import './style.css'
import game from './modules/Game'
import './modules/Controller'
import render from './modules/Render'

window.onload = () => {
    game.init();

    //  开启传送
    document.getElementById('chuansong-btn').onclick = () => {
        render.chuansong(game);
    }
    //  关闭
    document.getElementById('close-floor').onclick = () => {
        document.getElementById('floor').style.visibility = 'hidden';
    }
    //  打开菜单
    document.getElementById('menu-btn').onclick = () => {
        document.getElementById('menu-wrap').style.transform = 'translateX(-100vw)';
    }
    //  关闭菜单
    document.getElementById('close-menu').onclick = () => {
        document.getElementById('menu-wrap').style.transform = 'translateX(0)';
    }
    //  打开怪物图鉴
    document.getElementById('monster-book').onclick = () => {
        if( !game.player.items.monsterMenu ) {
            render.msg('没有获得怪物图鉴');
            return false;
        }
        render.monsterList(game);
        document.getElementById('monster-book-wrap').style.transform = 'translateY(-100%)';
    }
    //  关闭怪物图鉴
    document.getElementById('monster-book-close').onclick = () => {
        document.getElementById('monster-book-wrap').style.transform = 'translateY(0)';
    }
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




