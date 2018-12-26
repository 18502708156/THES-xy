var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BattleCtrl = (function () {
    function BattleCtrl() {
    }
    BattleCtrl.GetPos = function (my, index, pos) {
        if (pos === void 0) { pos = null; }
        var data = my ? BattleCtrl.POS_MY : BattleCtrl.POS_EM;
        if (pos == null) {
            pos = { x: 0, y: 0 };
        }
        if (data[index]) {
            pos.x = data[index][0];
            pos.y = data[index][1];
        }
        else {
            pos.x = 0;
            pos.y = 0;
        }
        return pos;
    };
    BattleCtrl.GetOffsetPos = function (target, pos) {
        if (pos === void 0) { pos = null; }
        var isMy = target.GetInfo().IsSide();
        var p = this.GetPos(isMy, target.GetInfo().posIndex, pos);
        if (isMy) {
            p.x -= BattleCtrl.POS_OFFSET.x;
            p.y -= BattleCtrl.POS_OFFSET.y;
        }
        else {
            p.x += BattleCtrl.POS_OFFSET.x;
            p.y += BattleCtrl.POS_OFFSET.y;
        }
        return p;
    };
    BattleCtrl.GetOffsetBlockPos = function (target, pos) {
        if (pos === void 0) { pos = null; }
        var isMy = target.GetInfo().IsSide();
        var p = this.GetPos(isMy, target.GetInfo().posIndex, pos);
        if (isMy) {
            p.x -= BattleCtrl.BLOCK_POS_OFFSET.x;
            p.y -= BattleCtrl.BLOCK_POS_OFFSET.y;
        }
        else {
            p.x += BattleCtrl.BLOCK_POS_OFFSET.x;
            p.y += BattleCtrl.BLOCK_POS_OFFSET.y;
        }
        return p;
    };
    // static POS_EM = [
    // 	[113, 507], // 无效
    // 	[113, 507],
    // 	[206, 460],
    // 	[299, 413],
    // 	[392, 365],
    // 	[485, 318],
    // 	[33, 443],
    // 	[126, 396],
    // 	[219, 349],
    // 	[312, 301],
    // 	[405, 254]
    // ]
    // static POS_MY = [
    // 	[208, 720],	 // 无效
    // 	[208, 720],
    // 	[301, 673],
    // 	[394, 626],
    // 	[487, 578],
    // 	[580, 531],
    // 	[289, 783],
    // 	[382, 736],
    // 	[475, 689],
    // 	[568, 641],
    // 	[661, 594]
    // ]
    BattleCtrl.POS_EM = [
        [0, 253],
        [0, 253],
        [93, 206],
        [186, 159],
        [279, 111],
        [372, 64],
        [-80, 189],
        [13, 142],
        [106, 95],
        [199, 47],
        [292, 0],
    ];
    BattleCtrl.POS_MY = [
        [95, 466],
        [95, 466],
        [188, 419],
        [281, 372],
        [374, 324],
        [467, 277],
        [176, 529],
        [269, 482],
        [362, 435],
        [455, 387],
        [548, 340],
    ];
    BattleCtrl.POS_CENTER = { x: (BattleCtrl.POS_EM[3][0] + BattleCtrl.POS_MY[3][0]) >> 1, y: (BattleCtrl.POS_EM[3][1] + BattleCtrl.POS_MY[3][1]) >> 1 };
    BattleCtrl.POS_OFFSET = { x: 80, y: 60 };
    BattleCtrl.BLOCK_POS_OFFSET = { x: 64, y: 48 };
    BattleCtrl.MAX_INDEX = 9999;
    return BattleCtrl;
}());
__reflect(BattleCtrl.prototype, "BattleCtrl");
//# sourceMappingURL=BattleCtrl.js.map