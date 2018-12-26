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
var ItemBase = (function (_super) {
    __extends(ItemBase, _super);
    function ItemBase() {
        var _this = _super.call(this) || this;
        _this._count = 1;
        _this.touchEnabled = false;
        _this.touchChildren = true;
        _this.init();
        return _this;
    }
    ItemBase.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        if (this.count) {
            this.count.scaleX = 1 / this.scaleX;
            this.count.scaleY = 1 / this.scaleY;
        }
    };
    ItemBase.prototype.GetLTLabel = function () {
        if (!this.m_LTLabel) {
            var label = this.m_LTLabel = new eui.Label;
            label.size = 18;
            label.textColor = 0xfff01e;
            label.left = label.top = 12;
            label.stroke = 2;
            label.strokeColor = Color.Black;
            label.scaleX = 1 / this.scaleX;
            label.scaleY = 1 / this.scaleY;
        }
        if (!this.m_LTLabel.parent) {
            this.addChild(this.m_LTLabel);
        }
        return this.m_LTLabel;
    };
    /**触摸事件 */
    ItemBase.prototype.init = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
    };
    ItemBase.prototype.setItemCount = function (visible) {
        this.count.visible = visible;
    };
    ItemBase.prototype.setItemImg = function (itemName) {
        this.itemIcon.setItemImg(itemName);
    };
    ItemBase.prototype.setItemImgGray = function (gray) {
        this.itemIcon.setGray(gray);
    };
    ItemBase.prototype.setItemBg = function (value) {
        this.itemIcon.setItemBg(value);
    };
    ItemBase.prototype.SetQuality = function (quality) {
        if (!this.itemIcon) {
            return;
        }
        this.itemIcon.SetQuality(quality);
    };
    ItemBase.prototype.setDataByConfig = function (config) {
        this.itemIcon.setData(config);
        var nameStr = "";
        var colorStr = "";
        this.itemConfig = config;
        if (config.type == ItemType.EQUIP) {
            nameStr = config.level + "级";
            this.nameTxt.textColor = 0x682F00;
        }
        else if (ItemConst.ITEM_SHOW_RANK_TYPE[config.type]) {
            nameStr = config.level + "阶";
            this.nameTxt.textColor = 0x682F00;
            var str = nameStr;
            if (this.data.att && this.data.att.length) {
                str += StringUtils.addColor("+" + this.data.att.length, 0xd27701);
                this.GetLTLabel().textFlow = TextFlowMaker.generateTextFlow(str);
            }
            else {
                this.GetLTLabel().text = str;
            }
        }
        else {
            nameStr = config.name;
        }
        if (nameStr) {
            this.nameTxt.text = nameStr;
        }
        if (config.type != 0) {
            this.nameTxt.textColor = ItemBase.QUALITY_COLOR[config.quality];
        }
        if (this.num != undefined) {
            this.setCount(this.num + "");
        }
    };
    ItemBase.prototype.dataChanged = function () {
        this.clear();
        if (!isNaN(this.data)) {
            var id = this.data;
            this.itemConfig = GlobalConfig.ins().ItemConfig[id];
            this.setDataByConfig(this.itemConfig);
        }
        else if (egret.is(this.data, "ItemBaseData")) {
            var data = this.data;
            this.UpdateItemData(data.itemConfig);
        }
        else {
            var data = this.data;
            //奖励数据
            if (data.type == 0) {
                this.itemIcon.setItemImg(RewardData.getCurrencyRes(data.id));
                if (data.id == MoneyConst.yuanbao) {
                    this.itemIcon.setItemBg(ResDataPath.GetItemQualityName(4));
                }
                this.nameTxt.text = RewardData.getCurrencyName(data.id);
                this.nameTxt.textColor = 0xaa6a31;
                var count = data.count;
                (count != undefined && count > 1) ? this.setCount(count + "") : this.setCount("");
            }
            else if (data.type == 1) {
                this.UpdateItemData(GlobalConfig.ins().ItemConfig[data.id]);
            }
        }
        //设置红点
        this._UpdateRedPoint();
    };
    ItemBase.prototype.UpdateItemData = function (itemConfig) {
        this.itemConfig = itemConfig;
        if (!this.itemConfig)
            return;
        this.setDataByConfig(this.itemConfig);
        var count = this.data ? this.data.count : 0;
        if (count && count > 1) {
            this.setCount(this.data.count + "");
        }
        else {
            this.setCount("");
        }
        //如果是道具 而且存在角标字段
        if (this.data.lCorner) {
            this.itemIcon.SetCornerImg(this.data.lCorner);
        }
        if (this.data.corner != null) {
            this.itemIcon.SetCornerType(this.data.corner);
        }
    };
    ItemBase.prototype.setItemAward = function (type, id, count) {
        var award = {};
        award.type = type;
        award.id = id;
        award.count = count;
        this.data = award;
    };
    //显示背包以及需要使用的数量
    ItemBase.prototype.showCostNums = function () {
        if (this.data && this.data.id && this.data.count) {
            var nHave = GameGlobal.UserBag.GetCount(this.data.id);
            this.count.text = nHave + "/" + this.data.count;
            if (nHave >= this.data.count) {
                this.count.textColor = Color.Green;
            }
            else {
                this.count.textColor = Color.Red;
            }
        }
    };
    //_data 为配表数据  设置并刷新数据 
    ItemBase.prototype.setItemData = function (_data) {
        if (_data && typeof (_data) === "object") {
            this.data = _data;
            this.dataChanged(); //   
        }
    };
    ItemBase.prototype._UpdateRedPoint = function () {
        //设置红点
        this.redPoint.visible = this.data.canbeUsed;
    };
    ItemBase.prototype.IsShowRedPoint = function (isShow) {
        this.redPoint.visible = isShow;
    };
    /**
     * 清除格子数据
     */
    ItemBase.prototype.clear = function () {
        if (this.m_LTLabel && this.m_LTLabel.parent) {
            this.m_LTLabel.parent.removeChild(this.m_LTLabel);
        }
        this.itemConfig = null;
        if (this.itemIcon.setData != null) {
            this.itemIcon.setData(null);
        }
        else {
            console.log("itemicon setdata data error");
        }
        this.count.text = "";
        this.nameTxt.text = "";
        this.nameTxt.textColor = 0xFFFFFF;
    };
    ItemBase.prototype.destruct = function () {
        this.mCallback = null;
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
    };
    ItemBase.prototype.onClick = function () {
        if (this.mCallback) {
            this.mCallback(this);
            return;
        }
        this.showDetail();
    };
    ItemBase.prototype.showDetail = function () {
        var itemConfig = this.itemConfig;
        if (itemConfig != undefined && itemConfig && itemConfig.type != undefined) {
            if (ItemConst.OPEN_EQUIPS_TIPS[this.itemConfig.type]) {
                this.openEquipsTips();
            }
            else {
                this.openItemTips(this.itemConfig.id, this.getCount());
            }
        }
        else {
            if (this.data) {
                var itemId = this.data.id;
                var count = this.data.count || 0;
                if (!ItemBase.MONEYCONST_TO_ITEMCOFIG) {
                    ItemBase.MONEYCONST_TO_ITEMCOFIG = (_a = {},
                        _a[MoneyConst.exp] = 2000036,
                        _a[MoneyConst.gold] = 2000034,
                        _a[MoneyConst.yuanbao] = 2000033,
                        _a[MoneyConst.byb] = 2000032,
                        _a);
                }
                var id = ItemBase.MONEYCONST_TO_ITEMCOFIG[itemId];
                if (id) {
                    var itemConfig_1 = GameGlobal.Config.ItemConfig[id];
                    if (itemConfig_1) {
                        this.openItemTips(itemConfig_1.id, count);
                    }
                }
            }
        }
        var _a;
    };
    ItemBase.prototype.setCount = function (str) {
        this._count = Math.max(Number(str), 1);
        if (str.length > 4) {
            var wNum = Math.floor(Number(str) / 1000);
            // this._count = wNum
            str = wNum / 10 + "万";
        }
        this.count.text = str;
    };
    ItemBase.prototype.getCount = function () {
        return this._count;
    };
    ItemBase.prototype.openEquipsTips = function () {
        ViewManager.ins().open(EquipDetailedWin, this.itemConfig.id, this.data);
    };
    ItemBase.prototype.openItemTips = function (id, count) {
        var config = GameGlobal.Config.ItemConfig[id];
        if (config.pid && config.pid > 0) {
            ViewManager.ins().open(TianshenDetailWin, config, count);
            return;
        }
        ViewManager.ins().open(ItemDetailedWin, 0, id, count);
    };
    ItemBase.prototype.isShowName = function (b) {
        if (this.nameTxt) {
            this.nameTxt.visible = b;
        }
    };
    ItemBase.prototype.getText = function () {
        return this.nameTxt.text;
    };
    // public showEquipEffect() {
    //     if (this.itemConfig.quality <= 3 || this.itemConfig.type != 0)
    //         return;
    //     this.showEffect(this.itemConfig.quality)
    // }
    // public showEffect(e): void {
    //     this.equipEffect || (this.equipEffect = new MovieClip)
    //     this.equipEffect.blendMode = egret.BlendMode.ADD
    //     this.equipEffect.touchEnabled = false
    //     if (e >= 4) {
    //         if (e == 4) {
    //             this.equipEffect.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jlui_005"), true)
    //         } else {
    //             this.equipEffect.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jlui_006"), true)
    //         }
    //         this.equipEffect.x = 47
    //         this.equipEffect.y = 47
    //     }
    //     this.addChild(this.equipEffect)
    // }
    ItemBase.prototype.getTextColor = function () {
        return this.nameTxt.textColor;
    };
    // showItemEffect() {
    //     if (this.data && this.data.type == 0 && this.data.id == MoneyConst.yuanbao) {
    //         //元宝
    //         this.showEffect(4)
    //         return
    //     }
    //     return !this.itemConfig || this.itemConfig.quality <= 3 ? void (this.equipEffect && (this.equipEffect.clearCache(), DisplayUtils.removeFromParent(this.equipEffect))) : void this.showEffect(this.itemConfig.quality)
    // }
    ItemBase.prototype.setnameTxtVisible = function (bool) {
        if (bool === void 0) { bool = false; }
        this.nameTxt.visible = bool;
    };
    ItemBase.GetColorByQuality = function (quality) {
        var color = this.QUALITY_COLOR[quality];
        return color || this.QUALITY_COLOR[0];
    };
    ItemBase.MONEYCONST_TO_ITEMCOFIG = null;
    //提示框专用
    ItemBase.QUALITY_TIP_COLOR = [
        0xfdf1d2,
        0x4eec73,
        0x3fd7f1,
        0xd56dfb,
        0xff6c00,
        0xff4141,
        0xEFCBFB
    ]; //弃用的
    ItemBase.QUALITY_COLOR = [
        0x682f00,
        0x019704,
        0x6183f3,
        0xc400fd,
        0xd27701,
        0xdb0000,
        0xEFCBFB
    ];
    // 宠物技能颜色
    ItemBase.SKILL_NAME_COLOR = [
        "0xff0000",
        "0xff6e00",
        "0xaa00e9",
        "0x0095ff",
        "0x27a02a",
        "0xfdf1d2",
    ];
    // //提示框专用
    // public static QUALITY_TIP_COLOR = [
    //     0xfdf1d2, //普通 
    //     0x00fc06, //绿色
    //     0x10ebff, //蓝色
    //     0xee78ff, //紫色
    //     0x682f00, //橙色
    //     0xff4141,//红色
    //     0xEFCBFB];//弃用的
    // public static QUALITY_COLOR = [
    //     0x682f00, // 0xf7f0f0, 
    //     0x019704,
    //     0x6183f3,
    //     0xc400fd,
    //     0xd27701,
    //     0xdb0000,
    //     0xEFCBFB];
    ItemBase.QUALITY_NAME_STR = [
        "白色",
        "绿色",
        "蓝色",
        "紫色",
        "橙色",
        "红色",
    ];
    return ItemBase;
}(eui.ItemRenderer));
__reflect(ItemBase.prototype, "ItemBase");
var ItemBaseNotName = (function (_super) {
    __extends(ItemBaseNotName, _super);
    function ItemBaseNotName() {
        return _super.call(this) || this;
    }
    ItemBaseNotName.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.nameTxt.visible = false;
    };
    return ItemBaseNotName;
}(ItemBase));
__reflect(ItemBaseNotName.prototype, "ItemBaseNotName");
var ItemBaseShowCount = (function (_super) {
    __extends(ItemBaseShowCount, _super);
    function ItemBaseShowCount() {
        return _super.call(this) || this;
    }
    ItemBaseShowCount.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    ItemBaseShowCount.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (this.data && this.data.count) {
            this.setCount(this.data.count);
        }
    };
    return ItemBaseShowCount;
}(ItemBase));
__reflect(ItemBaseShowCount.prototype, "ItemBaseShowCount");
//数量是1也显示
var ItemBaseShowCountNoName = (function (_super) {
    __extends(ItemBaseShowCountNoName, _super);
    function ItemBaseShowCountNoName() {
        return _super.call(this) || this;
    }
    ItemBaseShowCountNoName.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.nameTxt.visible = false;
    };
    ItemBaseShowCountNoName.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (this.data && this.data.count) {
            this.setCount(this.data.count);
        }
    };
    return ItemBaseShowCountNoName;
}(ItemBase));
__reflect(ItemBaseShowCountNoName.prototype, "ItemBaseShowCountNoName");
var ItemBaseCost = (function (_super) {
    __extends(ItemBaseCost, _super);
    function ItemBaseCost() {
        return _super.call(this) || this;
    }
    ItemBaseCost.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.showCostNums();
    };
    return ItemBaseCost;
}(ItemBase));
__reflect(ItemBaseCost.prototype, "ItemBaseCost");
//右上角带角标
var ItemRightCorner = (function (_super) {
    __extends(ItemRightCorner, _super);
    function ItemRightCorner() {
        return _super.call(this) || this;
    }
    ItemRightCorner.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.showCostNums();
    };
    return ItemRightCorner;
}(ItemBase));
__reflect(ItemRightCorner.prototype, "ItemRightCorner");
var ITEM_QUALITY;
(function (ITEM_QUALITY) {
    ITEM_QUALITY[ITEM_QUALITY["WHITE_QUALITY"] = 0] = "WHITE_QUALITY";
    ITEM_QUALITY[ITEM_QUALITY["GREEN_QUALITY"] = 1] = "GREEN_QUALITY";
    ITEM_QUALITY[ITEM_QUALITY["BLUE_QUALITY"] = 2] = "BLUE_QUALITY";
    ITEM_QUALITY[ITEM_QUALITY["VIOLET_QUALITY"] = 3] = "VIOLET_QUALITY";
    ITEM_QUALITY[ITEM_QUALITY["ORANGE_QUALITY"] = 4] = "ORANGE_QUALITY";
    ITEM_QUALITY[ITEM_QUALITY["RED_QUALITY"] = 5] = "RED_QUALITY";
})(ITEM_QUALITY || (ITEM_QUALITY = {}));
//# sourceMappingURL=ItemBase.js.map