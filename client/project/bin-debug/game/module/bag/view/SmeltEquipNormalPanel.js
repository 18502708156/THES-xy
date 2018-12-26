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
var SmeltEquipNormalPanel = (function (_super) {
    __extends(SmeltEquipNormalPanel, _super);
    function SmeltEquipNormalPanel() {
        var _this = _super.call(this) || this;
        _this.viewIndex = 0;
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    SmeltEquipNormalPanel.prototype.UpdateContent = function () {
        this.setItemData();
    };
    // 引导对象
    SmeltEquipNormalPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.smeltBtn2,
            _a;
        var _a;
    };
    SmeltEquipNormalPanel.prototype.childrenCreated = function () {
        this.smeltEquips = [];
        this.smeltEquips.length = Const.SMELT_COUNT;
        this.itemList.itemRenderer = SmeltEquipItem;
        this.dataInfo = new eui.ArrayCollection(this.smeltEquips);
        this.itemList.dataProvider = this.dataInfo;
    };
    ;
    SmeltEquipNormalPanel.prototype.OnOpen = function () {
        this.smeltBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.smeltBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        // this.itemList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        // this._AddItemClick()
        this._AddItemClick(this.itemList, this.onListViewClick);
        this.autocheck.addEventListener(egret.Event.CHANGE, this.chage, this);
        // this.group.visible = Deblocking.Check(DeblockingType.TYEP_01, true) //暂时没有vip功能
        this.group.visible = true;
        this.observe(MessageDef.BAG_DEAL_SMELT, this.smeltComplete);
        this.observe(MessageDef.postEquipCheckList, this.setItemList);
        this.autocheck.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_BAG_RONG_LIAN);
    };
    SmeltEquipNormalPanel.prototype.OnClose = function () {
        this.smeltBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        // this.itemList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        MessageCenter.ins().removeAll(this);
    };
    SmeltEquipNormalPanel.prototype.smeltComplete = function () {
        var n = this.itemList.numChildren;
        while (n--) {
            this.itemList.getChildAt(n).playEff();
        }
        this.setItemData();
    };
    SmeltEquipNormalPanel.prototype.setItemData = function () {
        this.smeltEquips = this.getSmeltData();
        this.dataInfo.replaceAll(this.smeltEquips);
    };
    /**
     * getSmeltData _type 类型,1为常规容量,2为大量容量, 件数由设置而定
     */
    SmeltEquipNormalPanel.prototype.getSmeltData = function (_type) {
        if (_type === void 0) { _type = 1; }
        var nType = _type || 1;
        var list1 = UserBag.ins().getOutEquips();
        var nCount = Const.SMELT_COUNT;
        if (nType == 2) {
            nCount = Const.SMELT_LARGE_COUNT;
        }
        if (list1.length < nCount) {
            this.creatListLength(list1, nCount);
        }
        else if (list1.length > nCount) {
            list1 = list1.slice(0, nCount);
        }
        return list1;
    };
    //填充返回的列表
    SmeltEquipNormalPanel.prototype.creatListLength = function (list, count) {
        if (list.length < count) {
            for (var i = 0; i < count; i++) {
                if (list[i] == undefined) {
                    list[i] = null;
                }
            }
        }
    };
    SmeltEquipNormalPanel.prototype.setItemList = function (list) {
        this.dataInfo.replaceAll(list);
        this.itemList.dataProvider = this.dataInfo;
    };
    ;
    SmeltEquipNormalPanel.prototype.chage = function () {
        if (Deblocking.Check(1)) {
            FuncOpenModel.SetData(FuncOpenModel.SAVE_BAG_RONG_LIAN, this.autocheck.selected);
        }
        else {
            this.autocheck.selected = false;
        }
    };
    SmeltEquipNormalPanel.prototype.onListViewClick = function (e) {
        var pItem = e.item;
        if (!pItem) {
            var smeltList = UserBag.ins().getBagSortQualityEquips(5, 0, 0);
            if (smeltList.length > 0) {
                ViewManager.ins().open(BagMakeEx);
            }
            else {
                UserTips.ins().showTips("|C:0xff0000&T:当前没有可熔炼的装备|");
            }
        }
    };
    SmeltEquipNormalPanel.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.smeltBtn:
                UserEquip.ins().sendSmeltEquip(this.smeltEquips);
                break;
            case this.smeltBtn2:
                UserEquip.ins().sendSmeltEquip(this.getSmeltData(2));
                break;
        }
    };
    ;
    SmeltEquipNormalPanel.NAME = "普通装备";
    return SmeltEquipNormalPanel;
}(BaseView));
__reflect(SmeltEquipNormalPanel.prototype, "SmeltEquipNormalPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=SmeltEquipNormalPanel.js.map