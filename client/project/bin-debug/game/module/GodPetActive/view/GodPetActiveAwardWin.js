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
var GodPetActiveAwardWin = (function (_super) {
    __extends(GodPetActiveAwardWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GodPetActiveAwardWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GodPetActiveAwardSkin";
        _this.commonWindowBg.SetTitle("神兽降临");
        return _this;
    }
    GodPetActiveAwardWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = GodPetAwardItem;
        UIHelper.SetLinkStyleLabel(this.labGoto);
        this._AddClick(this.labGoto, this._OnClicked);
    };
    GodPetActiveAwardWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.GODPETACTIVE_UPDATE_INFO, this.UpdateContent);
        this.UpdateContent();
        this.AddTimer(1000, 0, this.updateTime);
    };
    GodPetActiveAwardWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    GodPetActiveAwardWin.prototype.updateTime = function () {
        var duration = GameGlobal.GodPetActiveModel.GetEndtime() - GameServer.serverTimeMilli;
        this.labTime.text = DateUtils.format_17(duration);
        if (duration > 0)
            return;
        this.labTime.text = "";
        this.CloseSelf();
        TimerManager.ins().removeAll(this);
    };
    GodPetActiveAwardWin.prototype._OnClicked = function () {
        ViewManager.ins().open(GodPetActiveLotteryWin);
    };
    GodPetActiveAwardWin.prototype.UpdateContent = function () {
        this.labCostNum.text = GameGlobal.GodPetActiveModel.GetCashCount() + "\u5143\u5B9D";
        var datas = CommonUtils.GetArray(GameGlobal.Config.BeastAwardConfig, "id");
        var getWeight = function (config) {
            var confId = config.id;
            if (GameGlobal.GodPetActiveModel.HasRewardGained(confId)) {
                return confId + 10000;
            }
            if (GameGlobal.GodPetActiveModel.IsTargetDone(confId)) {
                return confId - 10000;
            }
            return confId;
        };
        datas.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(datas);
    };
    GodPetActiveAwardWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GodPetActiveAwardWin;
}(BaseEuiView));
__reflect(GodPetActiveAwardWin.prototype, "GodPetActiveAwardWin", ["ICommonWindow"]);
var GodPetAwardItem = (function (_super) {
    __extends(GodPetAwardItem, _super);
    function GodPetAwardItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GodPetAwardItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.btnGain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    GodPetAwardItem.prototype.dataChanged = function () {
        var config = this.data;
        this.btnGain.name = config.id;
        this.imgGained.visible = GameGlobal.GodPetActiveModel.HasRewardGained(config.id);
        this.btnGain.visible = !this.imgGained.visible;
        this.btnGain.enabled = GameGlobal.GodPetActiveModel.IsTargetDone(config.id);
        this.btnGain.label = this.btnGain.enabled ? "领取" : "未达到";
        UIHelper.ShowRedPoint(this.btnGain, this.btnGain.visible && this.btnGain.enabled);
        this.labText.text = "\u7D2F\u79EF\u6D88\u8D39\uFF1A" + config.money + "\u5143\u5B9D";
        this.list.dataProvider = new eui.ArrayCollection(config.reward);
    };
    GodPetAwardItem.prototype._OnBtnClick = function (e) {
        var targetId = parseInt(e.currentTarget.name);
        GameGlobal.GodPetActiveModel.SendGainAward(targetId);
    };
    return GodPetAwardItem;
}(eui.ItemRenderer));
__reflect(GodPetAwardItem.prototype, "GodPetAwardItem");
//# sourceMappingURL=GodPetActiveAwardWin.js.map