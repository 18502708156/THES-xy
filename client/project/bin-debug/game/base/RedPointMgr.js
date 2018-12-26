var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RedPointMgr = (function () {
    function RedPointMgr() {
    }
    RedPointMgr.Add = function (target) {
        this.m_RolePoints.push(target);
    };
    RedPointMgr.AddDelayCheck = function (target) {
        if (this.m_CheckPoints[target.GetType()]) {
            return;
        }
        this.m_CheckPoints[target.GetType()] = target;
        this._StartUpdate();
    };
    RedPointMgr.Init = function () {
        if (this.m_Init) {
            return;
        }
        this.m_Init = true;
        var count = 0;
        var fail = 0;
        for (var _i = 0, _a = this.m_RolePoints; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (!obj.Init()) {
                console.log("RedPoint初始化失败", obj);
                ++fail;
                continue;
            }
            else {
                ++count;
            }
            var messages = obj.GetMessageDef();
            for (var _b = 0, messages_1 = messages; _b < messages_1.length; _b++) {
                var msg = messages_1[_b];
                var list = this.m_MessageDefs[msg];
                if (!list) {
                    list = new RedPointMessage;
                    list.mType = msg;
                    list.AddListener();
                    this.m_MessageDefs[msg] = list;
                }
                list.Add(obj);
            }
        }
        console.log("RedPointMgr:Init", count, "fail", fail);
    };
    RedPointMgr._OnEnterFrame = function (t) {
        if (!SubRoles.ROLE_INIT) {
            return;
        }
        for (var k in this.m_CheckPoints) {
            this.m_CheckPoints[k].CheckAll();
            delete this.m_CheckPoints[k];
            return false;
        }
        this._StopUpdate();
        return false;
    };
    RedPointMgr._StartUpdate = function () {
        if (this.m_IsUpdate) {
            return;
        }
        this.m_IsUpdate = true;
        egret.startTick(this._OnEnterFrame, this);
    };
    RedPointMgr._StopUpdate = function () {
        if (!this.m_IsUpdate) {
            return;
        }
        this.m_IsUpdate = false;
        egret.stopTick(this._OnEnterFrame, this);
    };
    RedPointMgr.m_RolePoints = [];
    RedPointMgr.m_CheckPoints = {};
    RedPointMgr.m_MessageDefs = {};
    RedPointMgr.m_Init = false;
    RedPointMgr.m_IsUpdate = false;
    return RedPointMgr;
}());
__reflect(RedPointMgr.prototype, "RedPointMgr");
var RedPointMessage = (function () {
    function RedPointMessage() {
        this.mList = [];
        this.m_Index = 0;
        this.m_Length = 0;
    }
    RedPointMessage.prototype.AddListener = function () {
        GameGlobal.MessageCenter.addListener(this.mType, this.DoMessage, this);
    };
    RedPointMessage.prototype.DoMessage = function () {
        for (var _i = 0, _a = this.mList; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.OnMessage(this.mType)) {
                RedPointMgr.AddDelayCheck(data);
            }
        }
    };
    RedPointMessage.prototype.Add = function (data) {
        this.mList.push(data);
        this.m_Length = this.mList.length;
    };
    return RedPointMessage;
}());
__reflect(RedPointMessage.prototype, "RedPointMessage");
//# sourceMappingURL=RedPointMgr.js.map