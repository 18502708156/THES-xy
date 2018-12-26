var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SpeEquipItemEvent = (function () {
    function SpeEquipItemEvent() {
    }
    SpeEquipItemEvent.prototype.Handle = function (itemId) {
        var config = GameGlobal.Config.ItemConfig[itemId];
        if (!config) {
            return null;
        }
        var itemType = config.type;
        if (itemType == 0) {
            return MessageDef.BAG_USER_EQUIP_COUNT_UPDATE;
        }
        else if (itemType == 1) {
        }
        else {
            // 坐骑或者。。。装备
            if (ItemConst.ITEM_SHOW_RANK_TYPE[itemType]) {
                return MessageDef.USER_TEMPLATE_EQUIP_UPDATE_ + itemType;
            }
            else {
            }
        }
        // let itemType = Math.floor(itemId / 1000000)
        // // 装备
        // if (itemType == 1) {
        // 	 let type = Math.floor((itemId % 1000000) / 10000)
        // 	 // 坐骑装备
        // 	 if (type == 2) {
        // 		 return MessageDef.BAG_RIDE_EQUIP_UP
        // 	 } else if (type == 3) {
        // 		 return MessageDef.BAG_PET_EQUIP_UP
        // 	 } else if (type == 0) {
        // 		 // 角色装备，品质小于5
        // 		 if (Math.floor((itemId % 10000) / 1000) < 5) {
        // 			return MessageDef.BAG_USER_EQUIP_COUNT_UPDATE
        // 		}
        // 	 }
        // } else if (itemType == 2) {
        // 	let type = Math.floor((itemId % 10000) / 1000)
        // 	// if (type == 4) {
        // 	// 	// 宠物激活道具
        // 	// 	return MessageDef.BAG_XIANLV_ACT_ITEM
        // 	// } else 
        // 	if (type == 5) {
        // 		// 宠物激活道具
        // 		return MessageDef.BAG_PET_ACT_ITEM
        // 	}
        // }
        // return null
    };
    return SpeEquipItemEvent;
}());
__reflect(SpeEquipItemEvent.prototype, "SpeEquipItemEvent", ["ISpeItemEvent"]);
/**
1 开头是装备（包含角色，骑宠装备）
  1 00 2 001

  00  是道具小类型：（如：00角色装备，02坐骑装备，03翅膀装备（详情查看type字段注释））
  2   品质：白绿蓝紫橙红；
  001 装备等级段；
  


2开头的是道具
*/
//# sourceMappingURL=ISpeItemEvent.js.map