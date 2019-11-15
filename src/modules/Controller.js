import game from "./Game";
import {key} from './Global'

let up = document.getElementById('up');
let down = document.getElementById('down');
let left = document.getElementById('left');
let right = document.getElementById('right');

let upCtx = up.getContext('2d');
let downCtx = down.getContext('2d');
let leftCtx = left.getContext('2d');
let rightCtx = right.getContext('2d');

function path(context, callback) {
    context.beginPath();
    context.moveTo(100, 100);
    callback(context);
    context.closePath();
}

path(upCtx, context => {
    context.lineTo(35, 35);
    context.arcTo(100, -20, 165, 35, 100);
});
path(downCtx, context => {
    context.lineTo(35, 165);
    context.arcTo(100, 220, 165, 165, 100);
});
path(leftCtx, context => {
    context.lineTo(35, 35);
    context.arcTo(-20, 100, 35, 165, 100);
});
path(rightCtx, context => {
    context.lineTo(165, 35);
    context.arcTo(220, 100, 165, 165, 100);
});

const control = document.getElementById('control');
const offsetX = control.getBoundingClientRect().left;
const offsetY = control.getBoundingClientRect().top;

let direction = null;

function getDerection(x, y) {
    if (upCtx.isPointInPath(x, y)) {
        return 'up';
    } else if (downCtx.isPointInPath(x, y)) {
        return 'down';
    } else if (leftCtx.isPointInPath(x, y)) {
        return 'left';
    } else if (rightCtx.isPointInPath(x, y)) {
        return 'right';
    }
}

control.ontouchstart = function (ev) {
    if (game.running) {
        game.touching = true;
        game.clientX = ev.touches[0].clientX;
        game.clientY = ev.touches[0].clientY;
        let x = ev.touches[0].clientX - offsetX;
        let y = ev.touches[0].clientY - offsetY;
        direction = getDerection(x, y);
        this.className = direction;
        game.player.startMove(direction, game);
    }
}

control.ontouchmove = function (ev) {
    game.clientX = ev.touches[0].clientX;
    game.clientY = ev.touches[0].clientY;
    let x = ev.touches[0].clientX - offsetX;
    let y = ev.touches[0].clientY - offsetY;
    if (game.running) {
        game.touching = true;
        let tmp = getDerection(x, y);
        if (tmp !== direction) {
            this.className = tmp;
            direction = tmp;
            if (game.player.moveTo) {
                game.player.turnTo(tmp);
            } else {
                game.player.startMove(tmp, game);
            }

        }
    }
}

control.ontouchend = function () {
    this.className = '';
    game.player.isMove = false;
    game.player.turn = null;
    game.touching = false;
}

window.onkeyup = ev => {
    game.player.isMove = false;
    game.player.turn = null;
}

window.onkeydown = ev => {
    //  如果按下了方向键且该方向不是角色当前移动方向，则往栈中压入一个新的移动方向，且用户改变移动方向
    if (/^37|38|39|40$/.test(ev.keyCode) && game.running) {
        game.player.startMove(key[ev.keyCode], game);
    }
}