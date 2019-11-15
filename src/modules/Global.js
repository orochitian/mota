var grid = [];
for( var i=0; i<11; i++ ) {
    for( var j=0; j<11; j++ ) {
        grid.push([j*32, i*32]);
    }
}

let ctx = document.getElementById('game').getContext('2d');
ctx.scale(2, 2);

const StaticCtx = document.getElementById('static').getContext('2d');
StaticCtx.scale(2, 2);

const ActiveCtx = document.getElementById('active').getContext('2d');
ActiveCtx.scale(2, 2);


module.exports = {
    ctx,
    StaticCtx,
    ActiveCtx,
    grid,
    size: 32,
    key: {
        38: 'up',
        40: 'down',
        37: 'left',
        39: 'right'
    }
}