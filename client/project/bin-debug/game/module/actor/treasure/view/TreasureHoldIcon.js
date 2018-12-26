/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 法宝详情item
 *
 **/
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
var TreasureHoldIcon = (function (_super) {
    __extends(TreasureHoldIcon, _super);
    function TreasureHoldIcon() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "TreasureHoldIconSkin";
        _this.currentState = "have";
        return _this;
    }
    TreasureHoldIcon.prototype.childrenCreated = function () {
        // //点击响应
        this.baseCricle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnThisClick, this);
        this.imgLock.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
    };
    TreasureHoldIcon.prototype.dataChanged = function () {
        if (!this.data)
            return;
        //是否显示有锁
        if (typeof (this.data.lock) === "number") {
            if (this.data.lock === 1) {
                this.imgLock.source = "ui_bt_suo";
            }
            else {
                this.imgLock.source = "ui_bt_weisuo";
            }
        }
        else {
        }
        //圆形圆圈
        this.baseCricle.setData(this.data);
        if (this.data.name) {
            this.lbName.text = this.data.name;
        }
        if (this.data.quality) {
            this.lbName.textColor = ItemBase.QUALITY_COLOR[this.data.quality];
        }
        //等级
        if (typeof (this.data.level) === "number") {
            this.lbLv.text = this.data.level;
        }
        else {
        }
    };
    TreasureHoldIcon.prototype.OnClick = function (e) {
        switch (e.target) {
            case this.imgLock:
                var lock = 1;
                if (this.data.lock === 1) {
                    lock = 0;
                }
                GameGlobal.TreasureModel.sendSpellsResLock(lock, this.data.spellsId);
                break;
            case this.baseCricle:
                // ViewManager.ins().open(TreasureShowWin)
                break;
        }
    };
    TreasureHoldIcon.prototype.OnThisClick = function (e) {
        ViewManager.ins().open(TreasureArrInfo, this.data, this.data.nPos, false, GameLogic.ins().actorModel.name);
    };
    return TreasureHoldIcon;
}(eui.ItemRenderer));
__reflect(TreasureHoldIcon.prototype, "TreasureHoldIcon");
//# sourceMappingURL=TreasureHoldIcon.js.map