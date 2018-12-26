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
var SmeltEquipItem = (function (_super) {
    __extends(SmeltEquipItem, _super);
    function SmeltEquipItem() {
        return _super.call(this) || this;
    }
    SmeltEquipItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    ;
    SmeltEquipItem.prototype.dataChanged = function () {
        this.clear();
        if (this.data instanceof ItemData) {
            this.itemConfig = this.data.itemConfig;
            this.itemIcon.setData(this.itemConfig);
            this.nameTxt.textColor = Color.l_normal;
            if (this.itemConfig.type == 4) {
                this.nameTxt.text = this.itemConfig.name;
            }
            else {
                // if (this.itemConfig.subType == ForgeConst.EQUIP_POS_TO_SUB[EquipPos.DZI]) {
                // 	this.nameTxt.text = this.itemConfig.name;
                // }
                // else
                this.nameTxt.text = this.itemConfig.zsLevel > 0 ? (this.itemConfig.zsLevel + "阶") : ("lv." + this.itemConfig.level);
            }
            // this.itemIcon.imgJob.source = (this.itemConfig.type == ItemType.EQUIP || this.itemConfig.type == ItemType.WING) && this.itemConfig.job && this.itemIcon.imgJob.visible ? JobItemIconConst[this.itemConfig.job] : '';
            // this.itemIcon.setJobImg((this.itemConfig.type == ItemType.EQUIP || this.itemConfig.type == ItemType.WING) && this.itemConfig.job ? JobItemIconConst[this.itemConfig.job] : '')
        }
        else {
            this.itemIcon.setItemImg("ui_bt_plue3");
        }
    };
    ;
    SmeltEquipItem.prototype.onClick = function () {
    };
    ;
    SmeltEquipItem.prototype.playEff = function () {
        if (this.data) {
            UIHelper.PlayBoomEff(this);
        }
    };
    ;
    SmeltEquipItem.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.itemIcon.setItemImg("ui_bt_plue3");
    };
    return SmeltEquipItem;
}(ItemBase));
__reflect(SmeltEquipItem.prototype, "SmeltEquipItem");
//# sourceMappingURL=SmeltEquipItem.js.map