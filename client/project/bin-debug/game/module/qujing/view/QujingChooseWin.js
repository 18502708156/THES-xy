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
var QujingChooseWin = (function (_super) {
    __extends(QujingChooseWin, _super);
    function QujingChooseWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "QujingChooseSkin";
        _this.commonWindowBg.SetTitle("取经东归");
        _this._AddClick(_this.btnRefresh, _this._OnClick);
        _this._AddClick(_this.btnOneKey, _this._OnClick);
        _this._AddClick(_this.btnGoto, _this._OnClick);
        return _this;
    }
    QujingChooseWin.prototype.childrenCreated = function () {
        var baseInfo = GameGlobal.QujingModel.baseInfo;
        this.mChooseQuality = baseInfo.mQuality;
        var escortList = CommonUtils.GetArray(GameGlobal.Config.EscortAwardConfig, "id");
        var idx = 1;
        for (var _i = 0, escortList_1 = escortList; _i < escortList_1.length; _i++) {
            var config = escortList_1[_i];
            var itemName = "chooseItem" + idx;
            if (this[itemName]) {
                this[itemName].SetItemData(config);
            }
            idx++;
        }
    };
    QujingChooseWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.QUJING_UPDATE_BASEINFO, this.UpdateList);
        this.commonWindowBg.OnAdded(this);
        this.UpdateContent();
    };
    QujingChooseWin.prototype.OnClose = function () {
        TimerManager.ins().remove(this._DoTimer, this);
        this.commonWindowBg.OnRemoved();
    };
    QujingChooseWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnGoto:
                GameGlobal.QujingModel.SendStartEscort();
                ViewManager.ins().close(this);
                break;
            case this.btnOneKey:
                this.HandleOneKeyRefresh();
                break;
            case this.btnRefresh:
                this.HandleRefresh();
                break;
        }
    };
    QujingChooseWin.prototype.UpdateList = function () {
        this.RefreshOneKeyCost();
        var baseInfo = GameGlobal.QujingModel.baseInfo;
        this.mCurIdx = 1;
        this.mMaxCount = baseInfo.mQuality + 15 - this.mChooseQuality;
        this.SetButtonState(true);
        this.AddTimer(100, this.mMaxCount, this._DoTimer);
    };
    QujingChooseWin.prototype.UpdateContent = function () {
        var baseInfo = GameGlobal.QujingModel.baseInfo;
        var escortMaxCount = GameGlobal.Config.EscortBaseConfig.escortnum;
        this.labCount.text = escortMaxCount - baseInfo.mEscortCount + "/" + escortMaxCount;
        var maxConfig = GameGlobal.Config.EscortAwardConfig[5];
        var text = "|C:0x6e330b&T:\u62A4\u9001|C:0xdb0000&T:" + maxConfig.name + "||C:0x6e330b&T:\u88AB\u62E6\u622A\u65E0\u635F\u5931(||C:0x019704&T:\u4F18\u5148\u4F7F\u7528\u7ED1\u5143||C:0x6e330b&T:)||";
        this.labTip.textFlow = TextFlowMaker.generateTextFlow(text);
        var oneKeyCost = GameGlobal.Config.EscortBaseConfig.aotucost;
        this.piOneKey.type = oneKeyCost.id;
        this.piOneKey.price = oneKeyCost.count;
        this.RefreshOneKeyCost();
    };
    QujingChooseWin.prototype.RefreshOneKeyCost = function () {
        var refreshCost = GameGlobal.Config.EscortBaseConfig.refreshcost;
        this.piRefresh.type = refreshCost.id;
        this.piRefresh.price = refreshCost.count;
        var itemCost = GameGlobal.Config.EscortBaseConfig.aotuitem;
        if (GameGlobal.UserBag.GetCount(itemCost.id) >= itemCost.count) {
            this.piOneKey.type = itemCost.id;
            this.piOneKey.price = itemCost.count;
            return;
        }
    };
    QujingChooseWin.prototype._DoTimer = function () {
        this.mChooseQuality = this.mChooseQuality % 5 + 1;
        this.chooseItem1.SetChooseState(this.mChooseQuality);
        this.chooseItem2.SetChooseState(this.mChooseQuality);
        this.chooseItem3.SetChooseState(this.mChooseQuality);
        this.chooseItem4.SetChooseState(this.mChooseQuality);
        this.chooseItem5.SetChooseState(this.mChooseQuality);
        this.mCurIdx++;
        if (this.mCurIdx >= this.mMaxCount) {
            this.SetButtonState(false);
        }
    };
    QujingChooseWin.prototype.SetButtonState = function (isGray) {
        this.btnGoto.enabled = !isGray;
        this.btnOneKey.enabled = !isGray;
        this.btnRefresh.enabled = !isGray;
        this.btnGoto.filters = isGray ? Color.GetFilter() : null;
        this.btnOneKey.filters = isGray ? Color.GetFilter() : null;
        this.btnRefresh.filters = isGray ? Color.GetFilter() : null;
    };
    QujingChooseWin.prototype.HandleRefresh = function () {
        if (GameGlobal.QujingModel.IsMaxQuality()) {
            UserTips.ins().showTips("当前已是最高品质");
            return;
        }
        var refreshCost = GameGlobal.Config.EscortBaseConfig.refreshcost;
        if (Checker.Money(refreshCost.id, refreshCost.count))
            GameGlobal.QujingModel.SendRefreshQuality(QujingModel.REFRESH_TYPE_NORMAL);
    };
    QujingChooseWin.prototype.HandleOneKeyRefresh = function () {
        if (GameGlobal.QujingModel.IsMaxQuality()) {
            UserTips.ins().showTips("当前已是最高品质");
            return;
        }
        var itemCost = GameGlobal.Config.EscortBaseConfig.aotuitem;
        if (GameGlobal.UserBag.GetCount(itemCost.id) >= itemCost.count) {
            GameGlobal.QujingModel.SendRefreshQuality(QujingModel.REFRESH_TYPE_ITEM);
            return;
        }
        var oneKeyCost = GameGlobal.Config.EscortBaseConfig.aotucost;
        if (Checker.Money(oneKeyCost.id, oneKeyCost.count))
            GameGlobal.QujingModel.SendRefreshQuality(QujingModel.REFRESH_TYPE_QUILK);
    };
    QujingChooseWin.LAYER_LEVEL = LayerManager.UI_Main;
    return QujingChooseWin;
}(BaseEuiView));
__reflect(QujingChooseWin.prototype, "QujingChooseWin", ["ICommonWindow"]);
//# sourceMappingURL=QujingChooseWin.js.map