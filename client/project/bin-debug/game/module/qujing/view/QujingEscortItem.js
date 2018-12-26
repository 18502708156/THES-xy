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
var QujingEscortItem = (function (_super) {
    __extends(QujingEscortItem, _super);
    function QujingEscortItem() {
        var _this = _super.call(this) || this;
        _this.setSkin(new QujingEscortItemSkin);
        _this._AddClick(_this.item, _this._OnClick);
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.OnRemove, _this);
        return _this;
    }
    QujingEscortItem.prototype.SetItem = function (escortInfo, delayTime, info) {
        var _this = this;
        this.mDoneTime = escortInfo.mFinishTime;
        this.mPlayerId = escortInfo.mPlayerId;
        this.mRobbedCount = escortInfo.mRobbedCount;
        this.mInfo = info;
        var quality = escortInfo.mQuality;
        this.labName.textColor = ItemBase.GetColorByQuality(quality - 1);
        this.durationLab.SetColor(ItemBase.GetColorByQuality(quality - 1));
        this.durationLab.SetEndTime(this.mDoneTime, DurationLabel.TIMETEXT_TYPE_MMSS);
        this.durationLab.SetCallbackFunc(function () {
            _this.parent.removeChild(_this);
        });
        var config = GameGlobal.QujingModel.GetConfigByQuality(quality);
        this.imgIcon.source = config.icon;
        this.labName.text = escortInfo.mPlayerName;
        this.labPower.text = "\u6218\u529B:" + CommonUtils.overLength(escortInfo.mPower);
        this.AddTimer(delayTime, 1, this._SetAnimation);
    };
    QujingEscortItem.prototype._OnClick = function () {
        if (GameGlobal.Config.EscortBaseConfig.robnum <= this.mRobbedCount) {
            UserTips.ins().showTips("已经被抢光了");
            return;
        }
        if (GameGlobal.QujingModel.CanRob(this.mPlayerId))
            GameGlobal.QujingModel.SendGetEscortInfo(this.mPlayerId);
    };
    QujingEscortItem.prototype._SetAnimation = function () {
        var tw = egret.Tween.get(this.item, { loop: true });
        tw.to({ x: 900 }, this.mInfo.time * 1000).wait((26 - this.mInfo.time) * 1000);
    };
    QujingEscortItem.prototype.OnRemove = function () {
        egret.Tween.removeTweens(this.item);
    };
    return QujingEscortItem;
}(BaseView));
__reflect(QujingEscortItem.prototype, "QujingEscortItem");
//# sourceMappingURL=QujingEscortItem.js.map