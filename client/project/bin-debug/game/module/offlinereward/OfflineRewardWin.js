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
/**
 * 离线奖励
 */
var OfflineRewardWin = (function (_super) {
    __extends(OfflineRewardWin, _super);
    function OfflineRewardWin() {
        var _this = _super.call(this) || this;
        _this._resources = ["lixianshouyi_json"];
        return _this;
    }
    OfflineRewardWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "OfflineRewardSkin";
    };
    OfflineRewardWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "获得奖励";
        this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.open.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        for (var i = 1; i <= 5; ++i) {
            this["label" + i].text = "0";
        }
        this.update(param[0]);
        if (GameGlobal.FuliModel.FuliData.month > 0) {
            this.open.visible = false;
        }
        else {
            this.open.visible = true;
        }
    };
    OfflineRewardWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.okBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.open.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    OfflineRewardWin.prototype.update = function (arr) {
        this.time.text = "离线时间：" + DateUtils.getFormatBySecond(arr.offlineTime, DateUtils.TIME_FORMAT_9);
        // this.exp.text = "" + arr.exp;
        // this.money.text = "" + arr.money;
        this.label5.text = "" + (arr.equipNum1 + arr.equipNum2);
        if (arr.equipNum2 == 0) {
            this.bagFull.visible = false;
        }
        else {
            this.bagFull.visible = true;
            this.bagFull.textFlow = (new egret.HtmlTextParser).parser("背包已满，自动出售<a color=0x00FF00>" + arr.equipNum2 + "</a>件装备");
        }
        if (arr.offlineData.length > 0) {
            for (var i = 0; i < arr.offlineData.length; i++) {
                var obj = arr.offlineData[i];
                var index = (obj.type * 2) - 1;
                if (this["label" + index]) {
                    this["label" + index].text = obj.gold;
                }
                if (this["label" + (index + 1)]) {
                    this["label" + (index + 1)].text = obj.exp;
                }
            }
        }
    };
    OfflineRewardWin.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.okBtn:
                ViewManager.ins().close(this);
                break;
            case this.open:
                ViewManager.ins().close(OfflineRewardWin);
                RechargeWin.Open();
                //打开月卡介面
                break;
        }
    };
    OfflineRewardWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return OfflineRewardWin;
}(BaseEuiView));
__reflect(OfflineRewardWin.prototype, "OfflineRewardWin", ["ICommonWindow"]);
//# sourceMappingURL=OfflineRewardWin.js.map