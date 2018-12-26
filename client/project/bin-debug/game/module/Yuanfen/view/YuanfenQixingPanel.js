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
var YuanfenQixingPanel = (function (_super) {
    __extends(YuanfenQixingPanel, _super);
    function YuanfenQixingPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "YuanfenInfoSkin";
        _this.mType = 1;
        return _this;
    }
    YuanfenQixingPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = YuanfenItem;
    };
    YuanfenQixingPanel.prototype.UpdateContent = function () {
        this.powerLabel.text = GameGlobal.YuanfenModel.GetAllPower();
        var dataList = GameGlobal.YuanfenModel.GetDataList(this.mType);
        this.list.dataProvider = new eui.ArrayCollection(dataList);
    };
    YuanfenQixingPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateContent);
    };
    YuanfenQixingPanel.prototype.OnClose = function () {
    };
    YuanfenQixingPanel.NAME = "北斗七星";
    return YuanfenQixingPanel;
}(BaseView));
__reflect(YuanfenQixingPanel.prototype, "YuanfenQixingPanel", ["ICommonWindowTitle"]);
var YuanfenItem = (function (_super) {
    __extends(YuanfenItem, _super);
    function YuanfenItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    YuanfenItem.prototype.childrenCreated = function () {
        this.btnActive.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    YuanfenItem.prototype.dataChanged = function () {
        var config = this.data;
        this.labName.text = config.name;
        this.labAttr.textFlow = AttributeData.GetAttrTabString(config.attrs, " ");
        this.labPower.text = "+" + ItemConfig.CalcAttrScoreValue(config.attrs);
        this.imgAct.visible = GameGlobal.YuanfenModel.HasAct(config.id);
        this.btnActive.visible = !this.imgAct.visible;
        this.list.itemRenderer = YuanfenHeadItem;
        this.list.dataProvider = new eui.ArrayCollection(config.group);
    };
    YuanfenItem.prototype._OnBtnClick = function () {
        if (!GameGlobal.YuanfenModel.CanYuanfenAct(this.data.id)) {
            UserTips.ins().showTips("未集齐，不可激活");
            return;
        }
        GameGlobal.YuanfenModel.SendActCombo(this.data.id);
    };
    return YuanfenItem;
}(eui.ItemRenderer));
__reflect(YuanfenItem.prototype, "YuanfenItem");
var YuanfenHeadItem = (function (_super) {
    __extends(YuanfenHeadItem, _super);
    function YuanfenHeadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    YuanfenHeadItem.prototype.childrenCreated = function () {
        this.item.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    YuanfenHeadItem.prototype.dataChanged = function () {
        switch (this.data.type) {
            case 1://宠物
                this.SetPetInfo(this.data.id);
                break;
            case 2://天将
                this.SetTianshenInfo(this.data.id);
                break;
            case 3://仙侣
                this.SetXianlvInfo(this.data.id);
                break;
        }
    };
    YuanfenHeadItem.prototype._OnBtnClick = function () {
        ViewManager.ins().open(YuanfenTipWin, this.data);
    };
    YuanfenHeadItem.prototype.SetPetInfo = function (id) {
        var config = GameGlobal.Config.petBiographyConfig[id];
        if (!config)
            return;
        this.lbName.text = config.name;
        this.lbName.textColor = ItemBase.GetColorByQuality(config.quality);
        this.item.SetQuality(config.quality);
        this.item.setItemImg(PetConst.GetHeadIcon(id));
        this.item.setGray(!GameGlobal.PetModel.HasPet(id));
    };
    YuanfenHeadItem.prototype.SetXianlvInfo = function (id) {
        var config = GameGlobal.Config.partnerBiographyConfig[id];
        if (!config)
            return;
        this.lbName.text = config.name;
        this.lbName.textColor = ItemBase.GetColorByQuality(config.quality);
        this.item.SetQuality(config.quality);
        this.item.setItemImg("resource/assets/image/head/xianlv/" + config.icon + ".png");
        this.item.setGray(!GameGlobal.XianlvModel.HasXianlv(id));
    };
    YuanfenHeadItem.prototype.SetTianshenInfo = function (id) {
        var config = GameGlobal.Config.AirMarshalListConfig[id];
        if (!config)
            return;
        this.lbName.text = config.name;
        this.lbName.textColor = ItemBase.GetColorByQuality(config.quality);
        this.item.SetQuality(config.quality);
        this.item.setItemImg("resource/assets/image/head/tianshen/" + config.icon + ".png");
        this.item.setGray(!GameGlobal.TianShenModel.HasTianShen(id));
    };
    return YuanfenHeadItem;
}(eui.ItemRenderer));
__reflect(YuanfenHeadItem.prototype, "YuanfenHeadItem");
//# sourceMappingURL=YuanfenQixingPanel.js.map