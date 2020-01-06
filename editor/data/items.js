window.items = [
    //  黄钥匙
    {
        name: 'yellowkey',
    },
    //  蓝钥匙
    {
        name: 'bluekey',
    },
    //  红钥匙
    {
        name: 'redkey',
    },
    //  攻击宝石
    {
        name: 'attackgem',
    },
    //  防御宝石
    {
        name: 'defencegem',
    },
    //  大血瓶
    {
        name: 'hp',
    },
    //  小血瓶
    {
        name: 'hplarge',
    },
    //  幸运金币
    {
        name: 'luckycoins',
    },
    //  魔法钥匙
    {
        name: 'magickey',
    },
    //  传送权杖
    {
        name: 'chuansong',
    },
    //  记事本
    {
        name: 'notepad',
    },
    //  铁剑
    {
        name: 'tiejian',
    },
    //  铁盾
    {
        name: 'tiedun',
    },
    //  银剑
    {

        name: 'yinjian',
    },
    //  银盾
    {
        name: 'yindun',
    },
    //  骑士剑
    {
        name: 'qishijian',
    },
    //  骑士盾
    {
        name: 'qishidun',
    },
    //  圣剑
    {
        name: 'shengjian',
    },
    //  圣盾
    {
        name: 'shengdun',
    },
    //  神圣剑
    {
        name: 'shenshengjian',
    },
    //  神圣盾
    {
        name: 'shenshengdun',
    },
];

window.items = window.items.map(item => {
    item.type = 'item';
    item.active = false;
    item.src = './images/items/' + item.name + '.png';
    return item;
});