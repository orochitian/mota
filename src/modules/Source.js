const source = {
    //  角色
    player: require('../images/player.png'),
    playerIcon: require('../images/player_icon.png'),

    //  闪电
    attack: require('../images/attack.png'),
    fightLost: require('../images/fight_lost.png'),

    //  对战背景
    battle: require('../images/battleBg.jpg'),
    vs: require('../images/vs.png'),


    //  建筑
    wall: require('../images/builds/wall.png'),
    up: require('../images/builds/up.png'),
    down: require('../images/builds/down.png'),
    yellowgate: require('../images/builds/yellowgate.png'),
    bluegate: require('../images/builds/bluegate.png'),
    redgate: require('../images/builds/redgate.png'),
    greengate: require('../images/builds/greengate.png'),
    rail: require('../images/builds/rail.png'),

    //  物品
    attackgem: require('../images/items/attackgem.png'),
    defencegem: require('../images/items/defencegem.png'),
    hp: require('../images/items/hp.png'),
    hplarge: require('../images/items/hplarge.png'),
    yellowkey: require('../images/items/yellowkey.png'),
    bluekey: require('../images/items/bluekey.png'),
    redkey: require('../images/items/redkey.png'),
    luckycoins: require('../images/items/luckycoins.png'),
    chuansong: require('../images/items/chuansong.png'),
    tiejian: require('../images/items/tiejian.png'),
    tiedun: require('../images/items/tiedun.png'),

    //  NPC
    thief: require('../images/npc/thief.png'),
    business: require('../images/npc/business.png'),
    wise: require('../images/npc/wise.png'),

    //  怪物
    monster01: require('../images/monsters/monster01.png'),
    monster02: require('../images/monsters/monster02.png'),
    monster03: require('../images/monsters/monster03.png'),
    monster04: require('../images/monsters/monster04.png'),
    monster05: require('../images/monsters/monster05.png'),
    monster06: require('../images/monsters/monster06.png'),
    monster07: require('../images/monsters/monster07.png'),
    monster08: require('../images/monsters/monster08.png'),
    monster09: require('../images/monsters/monster09.png'),
    monster10: require('../images/monsters/monster10.png'),
    monster11: require('../images/monsters/monster11.png'),
    monster12: require('../images/monsters/monster12.png'),
    monster13: require('../images/monsters/monster13.png'),
    monster14: require('../images/monsters/monster14.png'),
    monster15: require('../images/monsters/monster15.png'),
    monster16: require('../images/monsters/monster16.png'),
    monster17: require('../images/monsters/monster17.png'),
    monster18: require('../images/monsters/monster18.png'),
    monster19: require('../images/monsters/monster19.png'),
    monster20: require('../images/monsters/monster20.png'),
    monster21: require('../images/monsters/monster21.png'),
    monster22: require('../images/monsters/monster22.png'),
    monster23: require('../images/monsters/monster23.png'),
    monster24: require('../images/monsters/monster24.png'),
    monster25: require('../images/monsters/monster25.png'),
    monster26: require('../images/monsters/monster26.png'),
    monster27: require('../images/monsters/monster27.png'),
    monster28: require('../images/monsters/monster28.png'),
    monster29: require('../images/monsters/monster29.png'),
    monster30: require('../images/monsters/monster30.png'),
    monster31: require('../images/monsters/monster31.png'),
    monster32: require('../images/monsters/monster32.png'),
    monster33: require('../images/monsters/monster33.png'),
}

for( img in source ) {
    let src = source[img];
    source[img] = new Image();
    source[img].src = src;
}

module.exports = source;