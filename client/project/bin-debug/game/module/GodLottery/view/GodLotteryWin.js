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
var GodLotteryWin = (function (_super) {
    __extends(GodLotteryWin, _super);
    function GodLotteryWin() {
        var _this = _super.call(this) || this;
        _this.mIdxList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        _this.skinName = "GodLotterySkin";
        _this.commonWindowBg.SetTitle("天神降临");
        return _this;
    }
    GodLotteryWin.prototype.childrenCreated = function () {
        this._AddClick(this.btnGoldOne, this._OnClicked);
        this._AddClick(this.btnGoldTen, this._OnClicked);
        this._AddClick(this.btnBindGoldTen, this._OnClicked);
        this._AddClick(this.btnShop, this._OnClicked);
    };
    GodLotteryWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.GODLOTTERY_UPDATE_LOTTERY, this.ShowLotteryAni);
        this.observe(MessageDef.GODLOTTERY_UPDATE_INFO, this.UpdateContent);
        GameGlobal.TreasureHuntModel.SendGetInfo();
        var bindGoldTenCost = GodLotteryConst.GetCost(GodLotteryConst.TYPE_BINDGOLD_TEN);
        this.piBindGoldTen.type = bindGoldTenCost.id;
        this.piBindGoldTen.price = bindGoldTenCost.count;
        var goldOneCost = GodLotteryConst.GetCost(GodLotteryConst.TYPE_GOLD_ONE);
        this.piGoldOne.type = goldOneCost.id;
        this.piGoldOne.price = goldOneCost.count;
        var goldTenCost = GodLotteryConst.GetCost(GodLotteryConst.TYPE_GOLD_TEN);
        this.piGoldTen.type = goldTenCost.id;
        this.piGoldTen.price = goldTenCost.count;
        this.SetShowList();
        this.UpdateContent();
    };
    GodLotteryWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    GodLotteryWin.prototype._OnClicked = function (e) {
        switch (e.currentTarget) {
            case this.btnGoldOne:
                this.Lottery(GodLotteryConst.TYPE_GOLD_ONE);
                break;
            case this.btnGoldTen:
                this.Lottery(GodLotteryConst.TYPE_GOLD_TEN);
                break;
            case this.btnBindGoldTen:
                this.Lottery(GodLotteryConst.TYPE_BINDGOLD_TEN);
                break;
            case this.btnShop:
                break;
        }
    };
    GodLotteryWin.prototype.Lottery = function (type) {
        var cost = GodLotteryConst.GetCost(type);
        Checker.Currency(cost, true, null, function () {
            GameGlobal.GodLotteryModel.SendLottery(type);
        });
    };
    GodLotteryWin.prototype.UpdateContent = function () {
        var lotteryCount = GameGlobal.GodLotteryModel.lotteryCount;
        var _a = GodLotteryConst.GetNextSpecailAward(lotteryCount), num = _a[0], nextSpecialAward = _a[1];
        this.groupFirst.visible = nextSpecialAward != null;
        if (nextSpecialAward) {
            this.firstItem.setItemAward(nextSpecialAward.type, nextSpecialAward.id, nextSpecialAward.count);
            this.labDesc1.textFlow = TextFlowMaker.generateTextFlow("\u518D\u62BD|C:0x019704&T:" + (num - lotteryCount) + "|\u6B21");
            var _b = this.GetItemName(nextSpecialAward.id), nameTxt = _b[0], color = _b[1];
            var text = "|C:0x6e330b&T:\u5FC5\u5F97 |C:" + color + "&T:" + nameTxt + "*" + nextSpecialAward.count + "|";
            this.labDesc2.textFlow = TextFlowMaker.generateTextFlow(text);
        }
    };
    GodLotteryWin.prototype.SetShowList = function () {
        var configList = GameGlobal.Config.TianShenLuckBaseConfig.showitem;
        var idx = 0;
        for (var _i = 0, configList_1 = configList; _i < configList_1.length; _i++) {
            var itemData = configList_1[_i];
            if (this["item" + idx])
                this["item" + idx].setItemAward(itemData.type, itemData.id, itemData.count);
            if (this["labName" + idx]) {
                var _a = this.GetItemName(itemData.id), nameTxt = _a[0], color = _a[1];
                this["labName" + idx].text = nameTxt;
                this["labName" + idx].textColor = color;
            }
            idx++;
        }
    };
    GodLotteryWin.prototype.ShowLotteryAni = function () {
        this.mCurIdx = 1;
        this.mMaxCount = 13;
        this.btnGoldOne.enabled = false;
        this.btnGoldTen.enabled = false;
        this.btnBindGoldTen.enabled = false;
        this.shuffleList();
        this.AddTimer(50, this.mMaxCount + 1, this._DoTimer);
    };
    GodLotteryWin.prototype._DoTimer = function () {
        for (var idx = 0; idx < 13; idx++) {
            var itemIdx = this.mIdxList[this.mCurIdx - 1] || 99;
            this["item" + idx].imgChoose.visible = idx == itemIdx;
        }
        this.mCurIdx++;
        if (this.mCurIdx > this.mMaxCount) {
            this.btnGoldOne.enabled = true;
            this.btnGoldTen.enabled = true;
            this.btnBindGoldTen.enabled = true;
            ViewManager.ins().open(GodLotteryResultPanel);
        }
    };
    GodLotteryWin.prototype.GetItemName = function (id) {
        var itemConfig = GlobalConfig.ins().ItemConfig[id];
        if (!itemConfig)
            return ["", ItemBase.QUALITY_COLOR[0]];
        return [itemConfig.name, ItemBase.QUALITY_COLOR[itemConfig.quality]];
    };
    GodLotteryWin.prototype.shuffleList = function () {
        for (var idx = 0; idx < this.mIdxList.length; ++idx) {
            var swapIdx = MathUtils.limitInteger(idx + 1, this.mIdxList.length - 1);
            var temp = this.mIdxList[swapIdx];
            this.mIdxList[swapIdx] = this.mIdxList[idx];
            this.mIdxList[idx] = temp;
        }
    };
    GodLotteryWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GodLotteryWin;
}(BaseEuiView));
__reflect(GodLotteryWin.prototype, "GodLotteryWin", ["ICommonWindow"]);
//# sourceMappingURL=GodLotteryWin.js.map