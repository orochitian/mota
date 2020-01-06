window.monsters = [];
for( let i=1; i<=33; i++ ) {
    window.monsters.push({
        name: i < 10 ? 'monster0' + i : 'monster' + i,
        type: 'monster',
        big: [15].includes(i) ? true : false,
        src: i< 10 ? './images/monsters/monster0' + i + '.png' : './images/monsters/monster' + i + '.png',
        active: false
    })
}