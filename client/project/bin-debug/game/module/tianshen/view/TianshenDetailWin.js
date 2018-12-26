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
var TianshenDetailWin = (function (_super) {
    __extends(TianshenDetailWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TianshenDetailWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "TianshenDetailSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    TianshenDetailWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var config = param[0];
        var count = param[1];
        this.item.setDataByConfig(config);
        this.item.setCount("" + (count || ""));
        this.labItemName.text = config.name;
        this.labItemName.textColor = ItemBase.GetColorByQuality(config.quality);
        var tianshenConfig = GameGlobal.Config.AirMarshalListConfig[config.pid];
        this.labName.text = tianshenConfig.name;
        this.labName.textColor = ItemBase.GetColorByQuality(tianshenConfig.quality);
        this.labItemDesc.text = "\u53EF\u7528\u4E8E\u6FC0\u6D3B\u5929\u795E\u3010" + tianshenConfig.name + "\u3011";
        this.labDesc.text = config.desc;
        this.showPanel.SetBody(GameGlobal.TianShenModel.GetSkin(config.pid));
    };
    TianshenDetailWin.prototype.OnClose = function () {
    };
    TianshenDetailWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return TianshenDetailWin;
}(BaseEuiView));
__reflect(TianshenDetailWin.prototype, "TianshenDetailWin");
//# sourceMappingURL=TianshenDetailWin.js.map