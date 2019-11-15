window.onload = () => {
    new Vue({
        el: '#app',
        watch: {
           'map.index'(newVal, oldVal) {
               this.map.area = Math.ceil(newVal / 10);
           }
        },
        data: {
            //  事件弹层是否显示
            eventModal: false,
            //  开门弹层是否显示
            openModal: false,
            //  开门对应的数据格式
            open: {
                type: 'greengate',
                gates: [],
                monsters: []
            },
            //  事件id
            eventID: '',
            //  放置时判断是否添加事件
            hasEvent: false,
            //  放置时判断是否开门
            openGate: false,
            //  添加事件弹层中需要使用当前放置位置的index
            eventIndex: 0,
            //  哪些模块展开
            collapseOpen: ['building', 'item', 'monster', 'npc', 'other'],
            //  地图信息
            map: {
                index: '',
                area: 1,
                up: '',
                down: '',
                grids: new Array(121),
            },
            //  当前选择的游戏对象
            current: null,
            builds: window.builds,
            items: window.items,
            monsters: window.monsters,
            npcs: window.npcs,
        },
        methods: {
            //  选择
            check(item, group) {
                if( item.active ) {
                    item.active = false;
                    this.current = null;
                } else {
                    group.map(item => item.active = false);
                    item.active = true;
                    this.current = item;
                }
            },
            //  添加事件
            eventOk() {
                this.map.grids[this.eventIndex].event = this.eventID;
            },
            //  添加事件
            openOk() {
                this.open.gates = this.open.gates.split(' ').map(item => parseInt(item));
                this.open.monsters = this.open.monsters.split(' ').map(item => parseInt(item));
                console.log(this.open);
                this.map.grids[this.eventIndex].open = this.open;
            },
            //  放置
            place(ev, index) {
                let grid = ev.target;
                if( this.map.grids[index] ) {
                    this.$Modal.confirm({
                        title: '是否清除？',
                        onOk: () => {
                            this.map.grids[index] = null;
                            grid.style.background = 'none';
                        }
                    });
                    return;
                }
                if( this.current ) {
                    this.eventIndex = index;
                    if( this.current.type === 'npc' || this.hasEvent ) {
                        this.eventModal = true;
                    }
                    if( this.current.type === 'monster' && this.openGate ) {
                        this.openModal = true;
                    }
                    grid.style.background = `url(${this.current.src}) no-repeat`;
                    this.map.grids[index] = { type: this.current.type, name: this.current.name };
                }
            },
            //  获取地图
            getMap() {
                this.$refs.result.select();
                if( document.execCommand("Copy") ) {
                    this.$Message.success({
                        content: '地图信息已成功复制到了粘贴板',
                        duration: 3
                    });
                }
                console.log(JSON.stringify(this.map));
            }
        },
        mounted() {
            // window.onkeydown = ev => {
            //     if( ev.keyCode === 116 ) {
            //         this.$Modal.confirm({
            //             title: '是否刷新页面？',
            //             onOk() {
            //                 window.location.reload();
            //             }
            //         });
            //         return false;
            //     }
            //     return true;
            // }
        }
    })
}