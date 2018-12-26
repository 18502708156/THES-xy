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
var XianlvInactiveView = (function (_super) {
    __extends(XianlvInactiveView, _super);
    function XianlvInactiveView() {
        var _this = _super.call(this) || this;
        _this.skinName = "XianlvInactiveSkin";
        _this.baseView.currentState = "inactive";
        if (_this.baseView.powerLabel["checkAttr"]) {
            _this.baseView.powerLabel["checkAttr"].visible = false;
        }
        _this._AddClick(_this.getwayLabel, _this._OnClick);
        _this._AddClick(_this.actBtn, _this._OnClick);
        _this._AddClick(_this.btnYuanfen, _this._OnClick);
        return _this;
    }
    XianlvInactiveView.prototype.OnOpen = function () {
        this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true);
        UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.IsRedPoint());
    };
    XianlvInactiveView.prototype.OnClose = function () {
    };
    XianlvInactiveView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.getwayLabel:
                {
                    // let config = GameGlobal.Config.partnerBiographyConfig[this.m_XianlvId]
                    // UserWarn.ins().setBuyGoodsWarn(config.material.id) 
                }
                break;
            case this.actBtn:
                var config = GameGlobal.Config.partnerBiographyConfig[this.m_XianlvId];
                if (config) {
                    if (Checker.Data(config.material)) {
                        GameGlobal.XianlvModel.SendActive(this.m_XianlvId);
                    }
                }
                break;
            case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin);
                break;
        }
    };
    XianlvInactiveView.prototype.UpdateInfo = function (id) {
        _super.prototype.UpdateInfo.call(this, id);
        this.m_XianlvId = id;
        var config = GameGlobal.Config.partnerBiographyConfig[id];
        this.needItemView.SetItemId(config.material.id, config.material.count);
        this.actBtn.visible = GameGlobal.UserBag.GetCount(config.material.id) >= config.material.count;
        if (this.getwayLabel.visible = !this.actBtn.visible) {
            this.getwayLabel.SetId(config.material.id);
        }
    };
    XianlvInactiveView.prototype.SetContext = function (context) {
        this.mContext = context;
    };
    return XianlvInactiveView;
}(XianlvBaseInfoPanel));
__reflect(XianlvInactiveView.prototype, "XianlvInactiveView");
var XianlvinactiveSkillItem = (function (_super) {
    __extends(XianlvinactiveSkillItem, _super);
    function XianlvinactiveSkillItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    XianlvinactiveSkillItem.prototype.dataChanged = function () {
        if (this.itemIndex == 0) {
            this.useTypeImg.visible = true;
        }
        else {
            this.useTypeImg.visible = false;
        }
    };
    return XianlvinactiveSkillItem;
}(eui.ItemRenderer));
__reflect(XianlvinactiveSkillItem.prototype, "XianlvinactiveSkillItem");
//# sourceMappingURL=XianlvInactiveView.js.map