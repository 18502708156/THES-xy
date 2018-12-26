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
var YuanfenTipWin = (function (_super) {
    __extends(YuanfenTipWin, _super);
    function YuanfenTipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "YuanfenTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    YuanfenTipWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._AddClick(this.labGain1, this._OnClicked);
        var config = param[0];
        switch (config.type) {
            case 1://宠物
                this.mConfig = this.SetPetInfo(config.id);
                break;
            case 2://天将
                this.mConfig = this.SetTianshenInfo(config.id);
                break;
            case 3://仙侣
                this.mConfig = this.SetXianlvInfo(config.id);
                break;
        }
        if (!this.mConfig)
            return;
        var gainConfig = GameGlobal.Config.GainItemConfig[this.mConfig.material.id];
        for (var idx = 1; idx < 3; idx++) {
            var info = gainConfig.gainWay[idx - 1];
            this["labGain" + idx].visible = info != null;
            if (info) {
                this["labGain" + idx].text = info[0];
                UIHelper.SetLinkStyleLabel(this["labGain" + idx]);
            }
        }
    };
    YuanfenTipWin.prototype._OnClicked = function (e) {
        switch (e.currentTarget) {
            case this.labGain1:
                this.HandleClick(0);
                break;
            case this.labGain2:
                this.HandleClick(1);
                break;
        }
    };
    YuanfenTipWin.prototype.HandleClick = function (idx) {
        var gainConfig = GameGlobal.Config.GainItemConfig[this.mConfig.material.id];
        var info = gainConfig.gainWay[idx];
        if (!info) {
            return;
        }
        ViewManager.ins().Guide(info[1][0], info[1][1]);
        ViewManager.ins().close(this);
    };
    YuanfenTipWin.prototype.SetPetInfo = function (id) {
        var config = GameGlobal.Config.petBiographyConfig[id];
        if (!config)
            return;
        this.labName.text = config.name;
        this.labName.textColor = ItemBase.GetColorByQuality(config.quality);
        YuanfenHeadIcon.setInfo(this.compHead, config.quality, PetConst.GetHeadIcon(id));
        this.labPower.text = "\u83B7\u5F97\u53EF\u63D0\u5347\u6218\u529B " + ItemConfig.CalcAttrScoreValue(config.attrs);
        return config;
    };
    YuanfenTipWin.prototype.SetXianlvInfo = function (id) {
        var config = GameGlobal.Config.partnerBiographyConfig[id];
        if (!config)
            return;
        this.labName.text = config.name;
        this.labName.textColor = ItemBase.GetColorByQuality(config.quality);
        YuanfenHeadIcon.setInfo(this.compHead, config.quality, "resource/assets/image/head/xianlv/" + config.icon + ".png");
        this.labPower.text = "\u83B7\u5F97\u53EF\u63D0\u5347\u6218\u529B " + ItemConfig.CalcAttrScoreValue(config.attrs);
        return config;
    };
    YuanfenTipWin.prototype.SetTianshenInfo = function (id) {
        var config = GameGlobal.Config.AirMarshalListConfig[id];
        if (!config)
            return;
        this.labName.text = config.name;
        this.labName.textColor = ItemBase.GetColorByQuality(config.quality);
        YuanfenHeadIcon.setInfo(this.compHead, config.quality, "resource/assets/image/head/tianshen/" + config.icon + ".png");
        this.labPower.text = "\u83B7\u5F97\u53EF\u63D0\u5347\u6218\u529B " + ItemConfig.CalcAttrScoreValue(config.attrs);
        return config;
    };
    YuanfenTipWin.prototype.OnClose = function () {
    };
    YuanfenTipWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return YuanfenTipWin;
}(BaseEuiView));
__reflect(YuanfenTipWin.prototype, "YuanfenTipWin");
var YuanfenHeadIcon = (function (_super) {
    __extends(YuanfenHeadIcon, _super);
    function YuanfenHeadIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    YuanfenHeadIcon.setInfo = function (comp, quality, icon) {
        comp.item.SetQuality(quality);
        comp.item.setItemImg(icon);
    };
    return YuanfenHeadIcon;
}(eui.Component));
__reflect(YuanfenHeadIcon.prototype, "YuanfenHeadIcon");
//# sourceMappingURL=YuanfenTipWin.js.map