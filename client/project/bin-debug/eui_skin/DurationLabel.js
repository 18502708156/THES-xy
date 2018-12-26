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
var DurationLabel = (function (_super) {
    __extends(DurationLabel, _super);
    function DurationLabel() {
        var _this = _super.call(this) || this;
        _this.skinName = 'DurationLabelSkin';
        return _this;
    }
    DurationLabel.prototype.childrenCreated = function () {
        this.label.text = "";
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.OnRemove, this);
    };
    /*
     *	定时器倒计时结束时的回调
     */
    DurationLabel.prototype.SetCallbackFunc = function (fun) {
        this.mCbFun = fun;
    };
    /*
    *	time: 结束时间戳 单位为秒
    *	type: 时间文本标式 HH:MM:SS MM:SS HH:MM三种
    */
    DurationLabel.prototype.SetEndTime = function (time, type) {
        if (type === void 0) { type = DurationLabel.TIMETEXT_TYPE_HHMMSS; }
        this.mEndTime = time;
        this.mType = type;
        var diffTime = this.mEndTime - GameServer.serverTime;
        this.label.text = this._GetText(Math.max(diffTime, 0));
        TimerManager.ins().remove(this._DoTimer, this);
        TimerManager.ins().doTimer(1000, 0, this._DoTimer, this);
    };
    /*
    *	text: 文本格式 如文本为 14:33后刷新商店  则传参为 {0}后刷新商店
    */
    DurationLabel.prototype.SetTextFormat = function (text) {
        this.mTextFormat = text;
    };
    DurationLabel.prototype.SetColor = function (color) {
        this.label.textColor = color;
    };
    DurationLabel.prototype.SetTextSize = function (size) {
        this.label.size = size;
    };
    /*
    *	停下定时器，一般用于 快速完成 操作，请求返回。主动停下定时器，以及回调方法的调用
    *	p.s 一般倒计时到0，会自动停下定时器回调。关闭窗口 也会停下定时器回调
    */
    DurationLabel.prototype.Stop = function () {
        TimerManager.ins().remove(this._DoTimer, this);
    };
    DurationLabel.prototype._DoTimer = function () {
        var diffTime = this.mEndTime - GameServer.serverTime;
        if (diffTime <= 0) {
            TimerManager.ins().remove(this._DoTimer, this);
            this.label.text = "";
            if (this.mCbFun) {
                this.mCbFun();
            }
            return;
        }
        this.label.text = this._GetText(diffTime);
    };
    DurationLabel.prototype.OnRemove = function () {
        TimerManager.ins().remove(this._DoTimer, this);
    };
    DurationLabel.prototype._GetText = function (diffTime) {
        var timeText = this._GetTimeText(diffTime);
        if (this.mTextFormat) {
            return this.mTextFormat.replace("{0}", timeText);
        }
        return timeText;
    };
    DurationLabel.prototype._GetTimeText = function (diffTime) {
        if (this.mType == DurationLabel.TIMETEXT_TYPE_ONLYSS) {
            return "" + diffTime;
        }
        var hour = Math.floor(diffTime / 3600);
        var min = Math.floor(diffTime / 60) % 60;
        var sec = diffTime % 60;
        if (this.mType == DurationLabel.TIMETEXT_TYPE_DDHH_HHMMSS) {
            if (hour < 23)
                return hour + ":" + this._Complement(min) + ":" + this._Complement(sec);
            var day = Math.floor(hour / 24);
            hour = hour % 24;
            return day + "\u5929" + hour + "\u65F6";
        }
        if (this.mType == DurationLabel.TIMETEXT_TYPE_HHMMSS) {
            return hour + ":" + this._Complement(min) + ":" + this._Complement(sec);
        }
        if (this.mType == DurationLabel.TIMETEXT_TYPE_HHMM) {
            return hour + ":" + this._Complement(min);
        }
        return this._Complement(hour * 60 + min) + ":" + this._Complement(sec);
    };
    DurationLabel.prototype._Complement = function (num) {
        if (num <= 9)
            return "0" + num;
        return num;
    };
    DurationLabel.TIMETEXT_TYPE_HHMMSS = 1;
    DurationLabel.TIMETEXT_TYPE_MMSS = 2;
    DurationLabel.TIMETEXT_TYPE_HHMM = 3;
    DurationLabel.TIMETEXT_TYPE_ONLYSS = 4;
    DurationLabel.TIMETEXT_TYPE_DDHH_HHMMSS = 5;
    return DurationLabel;
}(eui.Component));
__reflect(DurationLabel.prototype, "DurationLabel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=DurationLabel.js.map