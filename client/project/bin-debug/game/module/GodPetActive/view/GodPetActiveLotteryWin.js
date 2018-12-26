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
var GodPetActiveLotteryWin = (function (_super) {
    __extends(GodPetActiveLotteryWin, _super);
    function GodPetActiveLotteryWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GodPetActiveLotterySkin";
        _this.commonWindowBg.SetTitle("降服神兽");
        return _this;
    }
    GodPetActiveLotteryWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = GodPetLotteryItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
        this._AddClick(this.btnLottery, this._OnClicked);
        this._AddClick(this.labGain, this._OnClicked);
    };
    GodPetActiveLotteryWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.GODPETACTIVE_UPDATE_LOTTERY, this.ShowLotteryAni);
        this.observe(MessageDef.GODPETACTIVE_UPDATE_AWARDINFO, this.UpdateAwardList);
        this.observe(MessageDef.GODPETACTIVE_UPDATE_AWARDINFO, this.SetItemList);
        GameGlobal.GodPetActiveModel.SendGetAwardInfo();
        this.consumeLabel.mIsImg = true;
        UIHelper.SetLinkStyleLabel(this.labGain);
        this.UpdateContent();
    };
    GodPetActiveLotteryWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    GodPetActiveLotteryWin.prototype._OnClicked = function (e) {
        switch (e.currentTarget) {
            case this.btnLottery:
                var cost = GameGlobal.Config.BeastLotteryConfig.deplete[0];
                if (Checker.Data(cost))
                    GameGlobal.GodPetActiveModel.SendLottery();
                break;
            case this.labGain:
                ViewManager.ins().open(GodPetActiveTipWin);
                break;
        }
    };
    GodPetActiveLotteryWin.prototype.UpdateAwardList = function () {
        var datas = GameGlobal.GodPetActiveModel.GetAwardList();
        this.list.dataProvider = new eui.ArrayCollection(datas);
        this.list.validateNow();
    };
    GodPetActiveLotteryWin.prototype.UpdateContent = function () {
        this.SetItemList();
        var cost = GameGlobal.Config.BeastLotteryConfig.deplete[0];
        this.consumeLabel.SetItem(cost.id, cost.count, GameGlobal.UserBag.GetCount(cost.id));
    };
    GodPetActiveLotteryWin.prototype.SetItemList = function () {
        var configList = GameGlobal.Config.BeastLotteryConfig.showitem;
        var idx = 0;
        for (var _i = 0, configList_1 = configList; _i < configList_1.length; _i++) {
            var itemData = configList_1[_i];
            if (this["item" + idx]) {
                this["item" + idx].setItemAward(itemData);
            }
            idx++;
        }
    };
    GodPetActiveLotteryWin.prototype.ShowLotteryAni = function () {
        var cost = GameGlobal.Config.BeastLotteryConfig.deplete[0];
        this.consumeLabel.SetItem(cost.id, cost.count, GameGlobal.UserBag.GetCount(cost.id));
        this.mCurIdx = 1;
        this.mMaxCount = GameGlobal.GodPetActiveModel.GetAwardIdx() + 10;
        this.btnLottery.enabled = false;
        this.AddTimer(200, this.mMaxCount + 5, this._DoTimer);
    };
    GodPetActiveLotteryWin.prototype._DoTimer = function () {
        if (this.mCurIdx <= this.mMaxCount) {
            for (var idx = 0; idx < 10; idx++)
                this["item" + idx].showChoose(idx == (this.mCurIdx - 1) % 10);
        }
        this.mCurIdx++;
        if (this.mCurIdx > this.mMaxCount + 5) {
            this.btnLottery.enabled = true;
            ViewManager.ins().open(GodPetActiveResultPanel);
        }
    };
    GodPetActiveLotteryWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GodPetActiveLotteryWin;
}(BaseEuiView));
__reflect(GodPetActiveLotteryWin.prototype, "GodPetActiveLotteryWin", ["ICommonWindow"]);
var GodPetLotteryItem = (function (_super) {
    __extends(GodPetLotteryItem, _super);
    function GodPetLotteryItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GodPetLotteryItem.prototype.dataChanged = function () {
        var data = this.data;
        var itemConfig = GlobalConfig.ins().ItemConfig[data.id];
        var color = ItemBase.QUALITY_COLOR[itemConfig.quality];
        var text = "|C:0xffe87c&T:" + data.name + " |C:0xffffff&T:\u83B7\u5F97 |C:" + color + "&T:" + itemConfig.name + "*1|";
        this.labText.textFlow = TextFlowMaker.generateTextFlow(text);
    };
    return GodPetLotteryItem;
}(eui.ItemRenderer));
__reflect(GodPetLotteryItem.prototype, "GodPetLotteryItem");
//# sourceMappingURL=GodPetActiveLotteryWin.js.map