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
var SmeltEquipTotalWin = (function (_super) {
    __extends(SmeltEquipTotalWin, _super);
    function SmeltEquipTotalWin() {
        return _super.call(this) || this;
    }
    SmeltEquipTotalWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "SmeltMainViewSkin";
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(SmeltEquipNormalPanel, { skinName: "SmeltMainSkin" }),
        ];
        this.commonWindowBg.SetViewStack(this.viewStack);
        // this.tab.dataProvider = this.viewStack;
    };
    ;
    // public static OnOpen(index)
    // {
    // 	if(index == SmeltEquipTotalWin.HERO)
    // 	{
    // 		if(Deblocking.Check(DeblockingType.TYPE_12, true) == false)
    // 		{
    // 			Deblocking.Check(DeblockingType.TYPE_12)
    // 			return 
    // 		}
    // 	}
    // 	if(index == SmeltEquipTotalWin.PET)
    // 	{
    // 		if(Deblocking.Check(DeblockingType.TYPE_12, true) == false)
    // 		{
    // 			index --;
    // 		}
    // 	}
    // 	ViewManager.ins().open(SmeltEquipTotalWin,index)
    // }
    SmeltEquipTotalWin.getSubViewByIndex = function (index) {
        // if(index == SmeltEquipTotalWin.HERO)
        // {
        // 	if(Deblocking.Check(DeblockingType.TYPE_12, true) == false)
        // 	{
        // 		Deblocking.Check(DeblockingType.TYPE_12)
        // 		return null
        // 	}
        // }
        // if(index == SmeltEquipTotalWin.PET)
        // {
        // 	if(Deblocking.Check(DeblockingType.TYPE_12, true) == false)
        // 	{
        // 		index --;
        // 	}
        // }
        return ViewManager.ins().getView(SmeltEquipTotalWin).getSubViewByIndex(index);
    };
    SmeltEquipTotalWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var selectIndex = param[0] || 0;
        this.commonWindowBg.SetViewStack(this["viewStack"]);
        this.commonWindowBg.OnAdded(this, selectIndex);
        this.itemUpdate();
    };
    ;
    SmeltEquipTotalWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    ;
    SmeltEquipTotalWin.prototype.itemUpdate = function () {
        // this.commonWindowBg.ShowTalRedPoint(SmeltEquipTotalWin.RONG_LU, UserBag.ins().getWingZhuEquip().length >= 10)
        // if (UserBag.ins().getWingZhuEquip().length >= 10) {
        // 	this.redPoint.visible = true;
        // }
        // else {
        // 	this.redPoint.visible = false;
        // }
    };
    ;
    /**
     * 点击标签页按钮
     */
    // onTabTouch(e) {
    // this.viewStack.getElementAt(this.lastSelect)['close']();
    // this.lastSelect = this.viewStack.selectedIndex;
    // this.viewStack.getElementAt(this.lastSelect)['open']();
    // };
    // onTap(e) {
    // 	switch (e.currentTarget) {
    // 		case this.closeBtn:
    // 		case this.closeBtn0:
    // 			ViewManager.ins().close(this);
    // 			break;
    // 	}
    // };
    SmeltEquipTotalWin.prototype.OnBackClick = function (clickType) { return 0; };
    SmeltEquipTotalWin.prototype.OnOpenIndex = function (openIndex) { return true; };
    SmeltEquipTotalWin.EQUIP = 0;
    SmeltEquipTotalWin.RONG_LU = 1;
    SmeltEquipTotalWin.HERO = 2;
    SmeltEquipTotalWin.PET = 3;
    return SmeltEquipTotalWin;
}(BaseEuiView));
__reflect(SmeltEquipTotalWin.prototype, "SmeltEquipTotalWin", ["ICommonWindow"]);
SmeltEquipTotalWin.LAYER_LEVEL = LayerManager.UI_Main;
//# sourceMappingURL=SmeltEquipTotalWin.js.map