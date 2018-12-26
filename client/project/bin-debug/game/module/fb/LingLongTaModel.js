var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LingLongTaModel = (function () {
    function LingLongTaModel() {
        //普通和困难两种状态
        this.hard = 1; // tag 0
    }
    LingLongTaModel.prototype.parser = function (hard, layer) {
        this.hard = hard;
        this.layer = layer;
    };
    return LingLongTaModel;
}());
__reflect(LingLongTaModel.prototype, "LingLongTaModel");
//# sourceMappingURL=LingLongTaModel.js.map