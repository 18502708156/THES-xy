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
var MJPaceAwardWin = (function (_super) {
    __extends(MJPaceAwardWin, _super);
    function MJPaceAwardWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'MJPaceAwardWinSkin';
        _this.commonDialog.title = '每日步数达标奖励';
        _this.commonDialog.OnAdded(_this);
        _this.list.itemRenderer = MJPaceAwardItem;
        _this.list.dataProvider = new eui.ArrayCollection;
        return _this;
    }
    MJPaceAwardWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.MIJING_INIT_INFO, this._UpdateContent);
        this._UpdateContent();
    };
    MJPaceAwardWin.prototype.OnClose = function () {
        this.removeObserve();
        this.commonDialog.OnRemoved();
        this.list.dataProvider = null;
    };
    MJPaceAwardWin.prototype._UpdateContent = function () {
        var arr = [];
        var cfg = GameGlobal.Config.MythPaceConfig;
        for (var key in cfg) {
            arr.push(parseInt(key));
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    };
    MJPaceAwardWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return MJPaceAwardWin;
}(BaseEuiView));
__reflect(MJPaceAwardWin.prototype, "MJPaceAwardWin");
var MJPaceAwardItem = (function (_super) {
    __extends(MJPaceAwardItem, _super);
    function MJPaceAwardItem() {
        var _this = _super.call(this) || this;
        _this.skinName = 'MJPaceAwardItemSkin';
        _this.list.itemRenderer = ItemBase;
        return _this;
    }
    MJPaceAwardItem.prototype.dataChanged = function () {
        var cfg = GameGlobal.Config.MythPaceConfig[this.data];
        this.desc_txt.text = "今天前进" + cfg.pace + "步";
        this.list.dataProvider = new eui.ArrayCollection(cfg.rewards);
        var mjModel = GameGlobal.MiJingModel;
        if (mjModel.dailyPace >= cfg.pace) {
            this.getBtn.enabled = mjModel.GetPaceAwardState(cfg.id) == BitRewardState.CanGet;
            this.getBtn.label = this.getBtn.enabled ? "领取" : "已领取";
        }
        else {
            this.getBtn.enabled = false;
            this.getBtn.label = "领取";
        }
        this.pace_txt.textFlow = TextFlowMaker.generateTextFlow(StringUtils.addColor(mjModel.dailyPace + "", mjModel.dailyPace >= cfg.pace ? Color.l_green_1 : 0xff0000) + "/" + cfg.pace);
    };
    MJPaceAwardItem.prototype._OnClick = function (e) {
        if (this.getBtn.enabled == false) {
            return;
        }
        GameGlobal.MiJingModel.onSendGetPaceAward(this.data);
    };
    MJPaceAwardItem.prototype.childrenCreated = function () {
        this.getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    return MJPaceAwardItem;
}(eui.ItemRenderer));
__reflect(MJPaceAwardItem.prototype, "MJPaceAwardItem");
//# sourceMappingURL=MJPaceAwardWin.js.map