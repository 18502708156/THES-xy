var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CharMcOrder = (function () {
    function CharMcOrder() {
    }
    CharMcOrder.SHOWDOW = 0;
    CharMcOrder.HORSE = 1;
    CharMcOrder.BODY = 2;
    CharMcOrder.WEAPON = 3;
    CharMcOrder.WING = 4;
    CharMcOrder.FOUR = 5;
    CharMcOrder.HORSE_HEAD = 6;
    CharMcOrder.RING = 7;
    CharMcOrder.OTHER_TYPE = 0;
    CharMcOrder.CONTAINER_TYPE = 1;
    CharMcOrder.TITLE_TYPE = 2;
    return CharMcOrder;
}());
__reflect(CharMcOrder.prototype, "CharMcOrder");
//# sourceMappingURL=CharMcOrder.js.map