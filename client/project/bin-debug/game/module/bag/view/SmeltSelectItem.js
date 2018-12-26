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
var SmeltSelectItem = (function (_super) {
    __extends(SmeltSelectItem, _super);
    function SmeltSelectItem() {
        var _this = _super.call(this) || this;
        _this.translate = {
            'hp': AttributeType.atMaxHp,
            'atk': AttributeType.atAttack,
            'def': AttributeType.atDef,
            // 'res': AttributeType.atRes,
            'crit': AttributeType.atCrit,
            'tough': AttributeType.atTough
        };
        _this.skinName = "SmeltSeletctItemSkin";
        _this.touchChildren = false;
        return _this;
    }
    SmeltSelectItem.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    ;
    SmeltSelectItem.prototype.dataChanged = function () {
        if (this.data instanceof ItemData) {
            var data = this.data;
            //道具数据
            this.itemConfig = data.itemConfig;
            this.arrowIcon.visible = false;
            if (!this.itemConfig)
                return;
            // this.itemIcon.isShowJob(true)
            this.itemIcon.setData(this.itemConfig);
            if (this.itemConfig.type == 4) {
                this.updateWingEquip(); //比较披风装备
                this.lvLabel.text = this.itemConfig.name;
            }
            else if (this.itemConfig.type == 0) {
                //和身上的天珠装备比较评分
                // if (this.itemConfig.subType == ForgeConst.EQUIP_POS_TO_SUB[EquipPos.DZI]) {
                // 	var score = ItemConfig.calculateBagItemScore(data);
                // 	var len = SubRoles.ins().subRolesLen;
                // 	for (var i = 0; i < len; i++) {
                // 		var role = SubRoles.ins().getSubRoleByIndex(i);
                // 		if (!role.getEquipByIndex(EquipPos.DZI).item.itemConfig
                // 			|| score > ItemConfig.calculateBagItemScore(role.getEquipByIndex(EquipPos.DZI).item)) {
                // 			this.arrowIcon.visible = true;
                // 			break;
                // 		}
                // 	}
                // 	this.lvLabel.text = this.itemConfig.name;
                // }
                // else
                this.lvLabel.text = ((this.itemConfig.zsLevel) ? this.itemConfig.zsLevel + "阶" : "lv." + this.itemConfig.level);
            }
            else {
                this.lvLabel.text = '';
            }
            this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.itemConfig.quality];
            this.nameLabel.text = this.itemConfig.name;
            // let config = GlobalConfig.ins().EquipConfig[data.configID];
            // let attrStr:string = "";
            // let type:number = 0;
            // for(let k in this.translate) {
            //	 if(config[k] <= 0)
            //		 continue;
            //	 for(let i: number = 0;i < data.att.length; i++){
            //		 type = data.att[i].type;
            //		 if(this.translate[k] == type){
            //			 attrStr += AttributeData.getAttrStrByType(type) + ": ";
            //			 attrStr += config[k] + ' +' + data.att[i].value + "\n";
            //		 }
            //	 }
            // }
            this.gradeLabel.text = "评分：" + ItemConfig.calculateBagItemScore(data);
            this.attrLabel.text = AttributeData.getAttrInfoByItemData(data);
        }
    };
    ;
    //对比下披风装备
    SmeltSelectItem.prototype.updateWingEquip = function () {
    };
    ;
    return SmeltSelectItem;
}(eui.ItemRenderer));
__reflect(SmeltSelectItem.prototype, "SmeltSelectItem");
//# sourceMappingURL=SmeltSelectItem.js.map