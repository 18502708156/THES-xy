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
var DeityEquipItem = (function (_super) {
    __extends(DeityEquipItem, _super);
    function DeityEquipItem() {
        return _super.call(this) || this;
    }
    DeityEquipItem.prototype.childrenCreated = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.OpenEquipDetails, this);
    };
    DeityEquipItem.prototype.SetItemInfo = function (data, pos, showName) {
        if (showName === void 0) { showName = false; }
        this.mPos = pos;
        this.item.data = data.item;
        if (!data.item.configID || !DeityEquipConst.IsDeityEquip(data.item.configID)) {
            this.item.clear();
            this.item.setItemImg(ResDataPath.GetEquipDefaultGreyIcon(pos));
            this.labLv.text = "";
            this.labDesc.text = "";
            this.item.setItemCount(false);
            return;
        }
        this.item.data = data.item;
        if (showName) {
            this.labLv.text = data.item.itemConfig.name;
            this.labDesc.text = "Lv." + data.item.itemConfig.level;
            this.labLv.textColor = ItemBase.GetColorByQuality(data.item.itemConfig.quality);
        }
        else {
            this.labLv.text = "Lv." + data.item.itemConfig.level;
        }
    };
    DeityEquipItem.prototype.SetItemConfigId = function (id) {
        this.item.data = id;
        var config = GameGlobal.Config.ItemConfig[id];
        this.labLv.text = config ? config.name : "";
        this.labDesc.text = config ? "Lv." + config.level : "";
        if (config)
            this.labLv.textColor = ItemBase.GetColorByQuality(config.quality);
    };
    DeityEquipItem.prototype.UnshowDetail = function () {
        this.item.destruct();
    };
    DeityEquipItem.prototype.ChooseItem = function (b) {
        this.item.imgChoose.visible = b;
    };
    DeityEquipItem.prototype.SetModel = function (m) {
        this.mModel = m;
    };
    DeityEquipItem.prototype.OpenEquipDetails = function () {
        if (!this.mModel || !this.item.data.configID || !DeityEquipConst.IsDeityEquip(this.item.data.configID))
            return;
        ViewManager.ins().open(EquipUserDetailedWin, this.item.data.handle, this.item.data.configID, this.item.data, this.mModel);
    };
    return DeityEquipItem;
}(eui.Component));
__reflect(DeityEquipItem.prototype, "DeityEquipItem", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=DeityEquipItem.js.map