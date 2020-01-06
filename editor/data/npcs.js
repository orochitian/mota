window.npcs = [
    //  小偷
    {
        name: 'thief',
    },
    //  贤者
    {
        name: 'wise',
    },
    //  商人
    {
        name: 'business',
    }
];

window.npcs = window.npcs.map(npc => {
    npc.type = 'npc';
    npc.active = false;
    npc.src = './images/npc/' + npc.name + '.png';
    return npc;
});