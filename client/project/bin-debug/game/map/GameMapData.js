var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameMapData = (function () {
    function GameMapData() {
        // mapID: number
        this.mapX = 0;
        this.mapY = 0;
        this.fbType = 0;
    }
    return GameMapData;
}());
__reflect(GameMapData.prototype, "GameMapData");
//# sourceMappingURL=GameMapData.js.map