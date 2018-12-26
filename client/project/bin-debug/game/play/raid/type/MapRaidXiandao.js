var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MapRaidXiandao = (function (_super) {
    __extends(MapRaidXiandao, _super);
    function MapRaidXiandao() {
        return _super.call(this) || this;
    }
    MapRaidXiandao.prototype.OnEnter = function () {
        _super.prototype.OnEnter.call(this);
        if (!this.view) {
            this.view = new XiandaoSceneView;
        }
        this.AddView(this.view);
    };
    MapRaidXiandao.prototype.Clear = function () {
        _super.prototype.Clear.call(this);
        // 退出的时候清理定时器
        GameGlobal.XiandaoModel.ClearGetMapInfo();
    };
    return MapRaidXiandao;
}(CommonMapRaid));
__reflect(MapRaidXiandao.prototype, "MapRaidXiandao");
//# sourceMappingURL=MapRaidXiandao.js.map