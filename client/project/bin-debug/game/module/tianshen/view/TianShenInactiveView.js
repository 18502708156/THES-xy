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
var TianShenInactiveView = (function (_super) {
    __extends(TianShenInactiveView, _super);
    function TianShenInactiveView() {
        var _this = _super.call(this) || this;
        _this.skinName = "TianShenInactiveSkin";
        _this.baseView.currentState = "inactive";
        _this._AddClick(_this.getwayLabel, _this._OnClick);
        _this._AddClick(_this.actBtn, _this._OnClick);
        _this._AddClick(_this.btnYuanfen, _this._OnClick);
        UIHelper.SetLinkStyleLabel(_this.getwayLabel);
        return _this;
    }
    TianShenInactiveView.prototype.OnOpen = function () {
        this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true);
        UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.IsRedPoint());
    };
    TianShenInactiveView.prototype.OnClose = function () {
    };
    TianShenInactiveView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.getwayLabel:
                UserWarn.ins().setBuyGoodsWarn(this.needItemView.mItemId);
                break;
            case this.actBtn:
                var config = GameGlobal.Config.AirMarshalListConfig[this.m_TianShenId];
                if (config) {
                    if (Checker.Data(config.material)) {
                        GameGlobal.TianShenModel.SendActive(this.m_TianShenId);
                    }
                }
                break;
            case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin);
                break;
        }
    };
    TianShenInactiveView.prototype.UpdateInfo = function (id) {
        _super.prototype.UpdateInfo.call(this, id);
        this.m_TianShenId = id;
        var config = GameGlobal.Config.AirMarshalListConfig[id];
        this.needItemView.SetItemId(config.material.id, config.material.count);
        this.actBtn.visible = GameGlobal.UserBag.GetCount(config.material.id) >= config.material.count;
        this.getwayLabel.visible = !this.actBtn.visible;
    };
    TianShenInactiveView.prototype.SetContext = function (context) {
        this.mContext = context;
    };
    return TianShenInactiveView;
}(TianShenBaseInfoPanel));
__reflect(TianShenInactiveView.prototype, "TianShenInactiveView");
//# sourceMappingURL=TianShenInactiveView.js.map