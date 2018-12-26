var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RoleAutoSendData = (function () {
    function RoleAutoSendData(sendFunc, stateChange, checkTime) {
        if (checkTime === void 0) { checkTime = 200; }
        this.mIsAuto = false;
        this.mStep = 0;
        this.mSendFunc = sendFunc;
        this.mStateChange = stateChange;
        this.mTime = checkTime;
    }
    RoleAutoSendData.prototype.Continue = function () {
        this.mStep = BitUtil.Set(this.mStep, RoleAutoSendData.CONTINUE, true);
        this.CallFunc();
    };
    RoleAutoSendData.prototype.Toggle = function () {
        if (this.mIsAuto) {
            this.Stop();
        }
        else {
            this.Start();
        }
    };
    RoleAutoSendData.prototype.Start = function () {
        if (this.mIsAuto) {
            return;
        }
        this.mIsAuto = true;
        this.mStep = RoleAutoSendData.ALL;
        TimerManager.ins().doTimer(this.mTime, 0, this.Update, this);
        if (this.mStateChange) {
            this.mStateChange();
        }
    };
    RoleAutoSendData.prototype.Stop = function () {
        this.mStep = 0;
        if (!this.mIsAuto) {
            return;
        }
        this.mIsAuto = false;
        TimerManager.ins().removeAll(this);
        if (this.mStateChange) {
            this.mStateChange();
        }
    };
    RoleAutoSendData.prototype.Update = function () {
        this.mStep = BitUtil.Set(this.mStep, RoleAutoSendData.UPDATE, true);
        this.CallFunc();
    };
    RoleAutoSendData.prototype.Release = function () {
        this.Stop();
        this.mSendFunc = null;
    };
    RoleAutoSendData.prototype.CallFunc = function () {
        if (this.mStep != RoleAutoSendData.ALL) {
            return;
        }
        if (this.mSendFunc) {
            this.mSendFunc();
        }
        this.mStep = 0;
    };
    RoleAutoSendData.CONTINUE = 1;
    RoleAutoSendData.UPDATE = 2;
    RoleAutoSendData.ALL = (1 << RoleAutoSendData.CONTINUE) + (1 << RoleAutoSendData.UPDATE);
    return RoleAutoSendData;
}());
__reflect(RoleAutoSendData.prototype, "RoleAutoSendData");
//# sourceMappingURL=RoleAutoSendData.js.map