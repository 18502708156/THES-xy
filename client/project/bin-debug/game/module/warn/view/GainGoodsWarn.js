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
var GainGoodsWarn = (function (_super) {
    __extends(GainGoodsWarn, _super);
    function GainGoodsWarn() {
        return _super.call(this) || this;
    }
    GainGoodsWarn.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "GainGoodsNewSkin";
        this.gainList.itemRenderer = GainItem;
    };
    ;
    GainGoodsWarn.prototype.OnOpen = function () {
        this.commonDialog.SetReturnButton(this.dialogReturnBtn);
        this.commonDialog.OnAdded(this);
    };
    ;
    GainGoodsWarn.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        MessageCenter.ins().removeAll(this);
    };
    ;
    GainGoodsWarn.prototype.setData = function (ids) {
        this.gainList.dataProvider = new eui.ArrayCollection(ids);
        this.validateNow();
        // var len = this.gainList.dataProvider.length ;
        var h = (this.gainList.y - this.commonDialog.y) + this.gainList.height + 15;
        var targety = (this.height - h) / 2;
        var py = this.commonDialog.y - targety;
        this.commonDialog.y -= py;
        this.commonDialog.height = h;
        this.titleTxt.y -= py;
        this.gainList.y -= py;
        this.dialogReturnBtn.y = this.commonDialog.y + this.commonDialog.height - this.dialogReturnBtn.height + 5;
    };
    ;
    return GainGoodsWarn;
}(BaseEuiView));
__reflect(GainGoodsWarn.prototype, "GainGoodsWarn");
GainGoodsWarn.LAYER_LEVEL = LayerManager.UI_Popup;
var GainItem = (function (_super) {
    __extends(GainItem, _super);
    function GainItem() {
        var _this = _super.call(this) || this;
        _this.initEvent = false;
        _this.skinName = 'GainItemSkin';
        _this.gainList.itemRenderer = GainGoodsItem;
        return _this;
    }
    GainItem.prototype.onTouchList = function (e) {
        var item = e.target;
        if (!item) {
            return;
        }
        item = item.userData;
        if (item) {
            if (item[1][0]) {
                ViewManager.ins().closePartPanel();
                ViewManager.ins().close(ShopGoodsWarn);
            }
        }
    };
    ;
    GainItem.prototype.dataChanged = function () {
        var ids;
        if (typeof this.data == 'number') {
            ids = [this.data];
        }
        else {
            ids = this.data;
        }
        var i;
        var len1 = 3;
        for (i = 0; i < len1; i++) {
            var group = this['item' + i];
            if (ids.length <= i) {
                if (group.parent)
                    this.itemsGroup.removeChild(group);
                continue;
            }
            else {
                if (!group.parent)
                    this.itemsGroup.addChild(group);
            }
            var nameTxt = group.getChildAt(0);
            var itemIcon = group.getChildAt(1);
            // itemIcon.isShowName(false)
            var id_1 = ids[i];
            if (id_1 >= 101501 && id_1 <= 151505) {
                var itemConfig = GlobalConfig.ins().ItemConfig[id_1];
                // itemIcon.data = (itemConfig);
                itemIcon.setData(itemConfig);
                nameTxt.text = ids.length > 1 ? "" : ("" + itemConfig.name);
                nameTxt.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
            }
            else if (id_1 > 20000) {
                var itemConfig = GlobalConfig.ins().ItemConfig[id_1];
                // itemIcon.data = (itemConfig);
                itemIcon.setData(itemConfig);
                nameTxt.text = ids.length > 1 ? "" : "" + itemConfig.name;
                nameTxt.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
            }
            else {
                itemIcon.setItemAward(0, id_1, 1);
            }
        }
        var id = ids[0];
        var gainConfig = GlobalConfig.ins().GainItemConfig[id];
        if (gainConfig != null) {
            var config = gainConfig.gainWay.slice(0, gainConfig.gainWay.length);
            // for (let i = 0; i < config.length; ++i) {
            // let data = config[i]
            // if (data[1][0] == ViewIndexDef.ACT_GIFT) {
            // let activityData = ActivityModel.ins().GetActivityDataByType(2)
            // if (!ActivityModel.ins().IsOpen(activityData)) {
            // 	config.splice(i, 1)
            // }
            // if(id==ViewIndexDef.EGG_BROKEN_PANEL&&!EggBroken.IsOpen()){// 判断砸金蛋活动是否关闭
            //     config.splice(i, 1) 
            // } 
            // }
            // }
            this.gainList.dataProvider = new eui.ArrayCollection(config);
        }
        var len = this.gainList.dataProvider.length;
        this.gainList.height = len * 110;
    };
    GainItem.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        if (this.initEvent == false) {
            this.initEvent = true;
            this.gainList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchList, this);
        }
    };
    GainItem.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        if (this.initEvent == true) {
            this.initEvent = false;
            this.gainList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchList, this);
        }
    };
    return GainItem;
}(eui.ItemRenderer));
__reflect(GainItem.prototype, "GainItem");
//# sourceMappingURL=GainGoodsWarn.js.map