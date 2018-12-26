var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AStarNode = (function () {
    // nDir: any;
    // public constructor(x, y, dir) {
    function AStarNode(x, y) {
        this.nX = x;
        this.nY = y;
        // this.nDir = dir;
    }
    return AStarNode;
}());
__reflect(AStarNode.prototype, "AStarNode");
//# sourceMappingURL=AStarNode.js.map