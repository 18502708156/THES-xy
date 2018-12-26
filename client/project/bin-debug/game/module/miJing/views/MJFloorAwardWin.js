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
var MJFloorAwardWin = (function (_super) {
    __extends(MJFloorAwardWin, _super);
    function MJFloorAwardWin() {
        return _super.call(this) || this;
    }
    MJFloorAwardWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "MJFloorAwardWinSkin";
        this.list.itemRenderer = ItemBase;
    };
    MJFloorAwardWin.prototype.OnOpen = function () {
        var parme = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parme[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.AddClick(this.sure, this.onTap);
        var MythFloorRwConfig = GameGlobal.Config.MythFloorRwConfig;
        this.id = parme[0];
        this.desc.textFlow = TextFlowMaker.generateTextFlow("今天层数达标奖励：\r" + StringUtils.addColor("每次探索秘境一定层数可获得额外奖励", Color.l_green_1));
        this.dataList = MythFloorRwConfig[this.id].rewards;
        var mjModel = GameGlobal.MiJingModel;
        if (mjModel.floor >= MythFloorRwConfig[this.id].floor || mjModel.floor == mjModel.maxFloor) {
            this.sure.enabled = mjModel.GetFloorAwardState(this.id) == BitRewardState.CanGet;
            this.sure.label = this.sure.enabled ? "领取" : "已领取";
        }
        else {
            this.sure.label = "领取";
            this.sure.enabled = false;
        }
        this.list.dataProvider = new eui.ArrayCollection(this.dataList);
    };
    MJFloorAwardWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    MJFloorAwardWin.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.sure:
                if (this.sure.enabled == false) {
                    return;
                }
                GameGlobal.MiJingModel.onSendGetFloorAward(this.id);
                this.CloseSelf();
        }
    };
    MJFloorAwardWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return MJFloorAwardWin;
}(BaseEuiView));
__reflect(MJFloorAwardWin.prototype, "MJFloorAwardWin");
//# sourceMappingURL=MJFloorAwardWin.js.map