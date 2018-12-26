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
var PetTuJianPanel = (function (_super) {
    __extends(PetTuJianPanel, _super);
    function PetTuJianPanel() {
        return _super.call(this) || this;
    }
    PetTuJianPanel.prototype.childrenCreated = function () {
        this.List.itemRenderer = PetTuJianItem;
        var dataProvider = new eui.ArrayCollection();
        var pets = {};
        var config = GameGlobal.Config.petBiographyConfig;
        for (var key1 in config) {
            if (!pets[config[key1].pictype])
                pets[config[key1].pictype] = [];
            pets[config[key1].pictype].push(config[key1]);
        }
        for (var key in GameGlobal.Config.HandBookConfig) {
            SortTools.sortMap(pets[key], "id");
            var itemData = {};
            itemData["info"] = GameGlobal.Config.HandBookConfig[key];
            itemData["datas"] = pets[key];
            dataProvider.addItem(itemData);
        }
        this.List.dataProvider = dataProvider;
    };
    PetTuJianPanel.prototype.UpdateContent = function () {
    };
    PetTuJianPanel.NAME = "图鉴";
    return PetTuJianPanel;
}(BaseView));
__reflect(PetTuJianPanel.prototype, "PetTuJianPanel", ["ICommonWindowTitle"]);
var PetTuJianItem = (function (_super) {
    __extends(PetTuJianItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function PetTuJianItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetTuJianItemSkin";
        return _this;
    }
    PetTuJianItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.List.itemRenderer = PetTuJianItemIcon;
        this.getwaylabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
    };
    PetTuJianItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.List.dataProvider = new eui.ArrayCollection(this.data.datas);
        this.getwaylabel.text = this.data.info.name;
        this.getThroughTxt.text = this.data.info.name;
        UIHelper.SetLinkStyleLabel(this.getwaylabel);
    };
    PetTuJianItem.prototype.tap = function () {
        var config = GameGlobal.Config.HandBookConfig[this.data.info.id];
        var info;
        if (config.hasOwnProperty("gainWay"))
            info = config.gainWay[0];
        if (!info) {
            GameGlobal.UserTips.showTips(config.name);
            return;
        }
        ViewManager.ins().Guide(info[1][0], info[1][1]);
    };
    return PetTuJianItem;
}(eui.ItemRenderer));
__reflect(PetTuJianItem.prototype, "PetTuJianItem");
var PetTuJianItemIcon = (function (_super) {
    __extends(PetTuJianItemIcon, _super);
    /////////////////////////////////////////////////////////////////////////////
    function PetTuJianItemIcon() {
        return _super.call(this) || this;
    }
    PetTuJianItemIcon.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.skinName = "PetTuJianItemIconSkin";
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    PetTuJianItemIcon.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.item.setItemImg(PetConst.GetHeadPath(this.data.icon));
        this.item.SetQuality(this.data.quality);
        this.lbName.textColor = ItemBase.GetColorByQuality(this.data.quality);
        this.lbName.text = this.data.name;
        this.godImg.visible = GameGlobal.Config.petBiographyConfig[this.data.id].picshow;
    };
    PetTuJianItemIcon.prototype.onClick = function (e) {
        ViewManager.ins().open(PetInfoPanel, this.data);
    };
    return PetTuJianItemIcon;
}(eui.ItemRenderer));
__reflect(PetTuJianItemIcon.prototype, "PetTuJianItemIcon");
//# sourceMappingURL=PetTuJianPanel.js.map