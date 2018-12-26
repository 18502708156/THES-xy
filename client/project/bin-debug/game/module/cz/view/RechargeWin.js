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
var RechargeWin = (function (_super) {
    __extends(RechargeWin, _super);
    function RechargeWin() {
        var _this = _super.call(this) || this;
        _this.observe(MessageDef.FULI_MONTH_WEEK_CHANGE, _this.initData);
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    // 打开充值或者首充界面
    RechargeWin.Open = function () {
        if (GameGlobal.RechargeModel.choicerechare >= 0) {
            ViewManager.ins().open(RechargeAwardPanel);
        }
        else {
            ViewManager.ins().open(RechargeWin);
        }
    };
    RechargeWin.OpenMonthCard = function () {
        ViewManager.ins().open(RechargeWin);
    };
    RechargeWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "RechargeWinSkin";
        this.commonWindowBg.SetTitle("充值");
        // this.touchEnabled = false;
    };
    RechargeWin.prototype.initData = function () {
        this.itemList.itemRenderer = RechargeListItem;
        this.itemList.dataProvider = new eui.ArrayCollection(GameGlobal.RechargeModel.getListItemDate());
    };
    RechargeWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this._AddItemClick(this.itemList, this.itemClick);
        this._AddClick(this.vipTeQuanBtn, this.onClick);
        this.observe(MessageDef.UPDATA_VIP_EXP, this.UpdateContent);
        this.observe(MessageDef.RECHARGE_UPDATE, this.UpdateList);
        this.UpdateContent();
    };
    RechargeWin.prototype.onClick = function (e) {
        switch (e.target) {
            case this.vipTeQuanBtn:
                ViewManager.ins().open(VipMainPanel);
                break;
            default:
                break;
        }
    };
    RechargeWin.prototype.itemClick = function (e) {
        GameGlobal.RechargeModel.sendRecharge(this.itemList.selectedItem.id);
    };
    RechargeWin.prototype.UpdateList = function () {
        this.itemList.dataProvider.replaceAll(GameGlobal.RechargeModel.getListItemDate());
    };
    RechargeWin.prototype.UpdateContent = function () {
        if (GameGlobal.actorModel.vipLv < RechargeModel.MAX_VIPLV) {
            this.bar.maximum = GameGlobal.RechargeModel.getVipConfig()[GameGlobal.actorModel.vipLv + 1].needYb;
            var rechargeRMB = (this.bar.maximum - UserVip.ins().exp);
            this.nextVIPTxt.textFlow = TextFlowMaker.generateTextFlow("再充值" + '|C:0xFFED21&T:' + rechargeRMB + '|' + "元可成为" + '|C:0xFFED21&T:VIP' + (GameGlobal.actorModel.vipLv + 1) + '|');
            CommonUtils.addLableStrokeColor(this.nextVIPTxt, 0x460009, 3);
        }
        else {
            this.bar.maximum = UserVip.ins().exp;
            this.bar.value = UserVip.ins().exp;
            this.nextVIPTxt.text = "VIP等级已满";
        }
        this.bar.value = UserVip.ins().exp;
        this.curVipTxt.text = "" + GameGlobal.actorModel.vipLv;
        // CommonUtils.addLableStrokeColor(this.curVipTxt, 0x460009, 3);
    };
    RechargeWin.NAME = "充值";
    RechargeWin.LAYER_LEVEL = LayerManager.UI_Main;
    return RechargeWin;
}(BaseEuiView));
__reflect(RechargeWin.prototype, "RechargeWin");
var RechargeListItem = (function (_super) {
    __extends(RechargeListItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function RechargeListItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "RechargeItemSkin";
        return _this;
    }
    RechargeListItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    RechargeListItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.ybTxt.text = this.data.itemName;
        this.RMBTxt.text = this.data.cash + '元';
        this.SCZSTxt.text = this.data.award;
        this.centreImage.source = this.data.icon;
        this.otherTxt.text = this.data.exDesc;
        this.tipsImg.source = this.data.tipsicon;
        if (this.data.type == 1)
            this.currentState = "normal";
        else
            this.currentState = "other";
        this.SCGroup.visible = !GameGlobal.RechargeModel.reward[this.data.id] ? true : false;
    };
    return RechargeListItem;
}(eui.ItemRenderer));
__reflect(RechargeListItem.prototype, "RechargeListItem");
//# sourceMappingURL=RechargeWin.js.map