/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/5 18:51
 * @meaning: 灵童命格手动分解详情item
 *
 **/
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
var DestinyEquipItem = (function (_super) {
    __extends(DestinyEquipItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DestinyEquipItem() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "DestinyEquipItemSkin";
        _this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        return _this;
    }
    DestinyEquipItem.prototype.dataChanged = function () {
        if (this.data) {
            if (this.data.itemConfig.name) {
                this.nameLabel.text = this.data.itemConfig.name;
                this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.data.itemConfig.quality];
            }
            this.itemIcon.setDataByConfig(this.data.itemConfig);
            this.itemIcon.isShowName(false);
            this.itemIcon.setItemCount(false);
            var arrCon = GlobalConfig.ins().DestinyAttrsConfig[this.data.configID];
            if (arrCon.attars) {
                this.lbFight.text = "战力+" + ItemConfig.CalcAttrScoreValue(arrCon.attars);
                if (arrCon.attars[0]) {
                    this.lbInfo0.text = AttributeData.getAttStrByType(arrCon.attars[0], 0, ": ", false, '#682f00');
                }
                else {
                    this.lbInfo0.text = "";
                }
                if (arrCon.attars[1]) {
                    this.lbInfo1.text = AttributeData.getAttStrByType(arrCon.attars[1], 0, ": ", false, '#682f00');
                }
                else {
                    this.lbInfo1.text = "";
                }
            }
            else {
                this.lbFight.text = "";
                this.lbInfo0.text = arrCon.skillName || "";
                this.lbInfo1.text = arrCon.desc || "";
            }
        }
    };
    DestinyEquipItem.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.buy:
                //装备命格
                GameGlobal.MessageCenter.dispatch(MessageDef.DESTINY_EQUIP_REWARD, this.data.configID);
                break;
        }
    };
    return DestinyEquipItem;
}(eui.ItemRenderer));
__reflect(DestinyEquipItem.prototype, "DestinyEquipItem");
//# sourceMappingURL=DestinyEquipItem.js.map