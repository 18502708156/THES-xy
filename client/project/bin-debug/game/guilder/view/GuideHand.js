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
var GuideHand = (function (_super) {
    __extends(GuideHand, _super);
    function GuideHand() {
        var _this = _super.call(this) || this;
        _this.m_Type = 0;
        // private m_GuideId: number
        // private m_StepId: number
        _this.m_Listener = { ResetFunc: null, list: [] };
        _this.m_PosInvalid = false;
        _this.skinName = "GuideHandSkin";
        _this.touchEnabled = false;
        _this.touchChildren = false;
        _this.play.addEventListener('complete', _this.onTweenGroupComplete, _this);
        _this.mc = _this.mc || new MovieClip;
        _this.mc.x = 0;
        _this.mc.y = 0;
        _this.mc.loadFile(ResDataPath.GetUIEffePath2("ui_guide_001"), true, -1);
        _this.group.addChild(_this.mc);
        return _this;
    }
    GuideHand.prototype.Play = function () {
        this.mc.visible = true;
        this.play.play(0);
    };
    GuideHand.prototype.Pause = function () {
        this.mc.visible = false;
        this.play.play(0);
        this.play.pause();
    };
    GuideHand.prototype.onTweenGroupComplete = function () {
        if (!this.m_Target) {
            return;
        }
        this.play.play(0);
    };
    GuideHand.prototype.RemoveTargetEvent = function () {
        var target = this.m_Target;
        if (!target) {
            return;
        }
        for (var _i = 0, _a = this.m_Listener.list; _i < _a.length; _i++) {
            var data = _a[_i];
            data.target.removeEventListener(data.event, data.func, data.thisObject);
        }
        this.m_Listener.list = [];
        this.m_Listener.ResetFunc = null;
        this.m_Target = null;
        this.m_ObjParent = null;
    };
    GuideHand.prototype.AddEventListener = function (target, msg, func, thisObject, use, pri) {
        target.addEventListener(msg, func, thisObject, use, pri);
        this.m_Listener.list.push({
            target: target,
            event: msg,
            func: func,
            thisObject: thisObject,
        });
    };
    GuideHand.prototype.AddTargetEvent = function (target, guideId, step) {
        var gId = guideId;
        var sId = step;
        var OnTargetRemoved = function (e) {
            if (e.target != e.currentTarget) {
                return;
            }
            GameGlobal.GuideUtil.OnTargetRemoved(gId, sId);
        };
        var OnTargetTap = function () {
            GameGlobal.GuideUtil.OnTargetTap(gId, sId);
        };
        this.m_Listener.ResetFunc = function (guideId, step) {
            gId = guideId;
            sId = step;
        };
        this.AddEventListener(target, egret.Event.REMOVED_FROM_STAGE, OnTargetRemoved, this);
        this.AddEventListener(target, egret.Event.REMOVED, OnTargetRemoved, this);
        this.AddEventListener(target, egret.Event.ADDED, this.OnTargetAdded, this);
        this.AddEventListener(target, egret.TouchEvent.TOUCH_TAP, OnTargetTap, this, false, -999);
        this.m_Target = target;
    };
    GuideHand.prototype.OnTargetAdded = function (e) {
        if (e.target != e.currentTarget) {
            return;
        }
        this.OnTargetPosition();
    };
    GuideHand.prototype.GetTargetPosition = function () {
        var target = this.m_Target;
        if (!target) {
            return;
        }
        var point = egret.$TempPoint;
        DisplayUtils.GetGlobalPos(target, point);
        this.globalToLocal(point.x, point.y, point);
        return {
            x: point.x + (target.width >> 1),
            y: point.y + (target.height >> 1)
        };
    };
    GuideHand.prototype.OnTargetPosition = function () {
        var target = this.m_Target;
        if (!target) {
            return;
        }
        var point = this.GetTargetPosition();
        if (!point) {
            return;
        }
        this.group.x = point.x;
        this.group.y = point.y;
    };
    GuideHand.prototype.OnMoveTargetPosition = function () {
        var target = this.m_Target;
        if (!target) {
            return;
        }
        var point = this.GetTargetPosition();
        if (!point) {
            return;
        }
        this.m_CX = this.group.x;
        this.m_CY = this.group.y;
        this.m_EX = point.x;
        this.m_EY = point.y;
        var x1 = this.m_EX - this.m_CX;
        var y1 = this.m_EY - this.m_CY;
        var len = Math.sqrt(x1 * x1 + y1 * y1);
        this.m_Time = 0;
        this.m_Duration = Math.ceil(len / GuideHand.SPEED * 1000);
    };
    GuideHand.prototype.OnClose = function () {
        this.RemoveTargetEvent();
    };
    GuideHand.prototype.OnUpdate = function (delta) {
        if (this.m_Target && this.m_ObjParent) {
            if (this.m_Target.$visible && this.m_ObjParent.$visible && !this.$visible) {
                this.$setVisible(true);
            }
            else if ((!this.m_Target.$visible || !this.m_ObjParent.$visible) && this.$visible) {
                this.$setVisible(false);
            }
        }
        switch (this.m_Type) {
            case GuideHand.TYPE_STAND:
                this.OnTargetPosition();
                break;
            case GuideHand.TYPE_MOVE:
                if (this.m_PosInvalid) {
                    this.OnMoveTargetPosition();
                    this.m_PosInvalid = false;
                }
                else {
                    this.m_Time += delta;
                    var tmp = void 0;
                    if (this.m_Time >= this.m_Duration) {
                        tmp = 1;
                        this.m_Duration = 0;
                    }
                    else {
                        tmp = this.m_Time / this.m_Duration;
                    }
                    tmp = egret.Ease.sineOut(tmp);
                    MathUtils.Lerp(this.m_CX, this.m_CY, this.m_EX, this.m_EY, tmp, this.group);
                    if (tmp >= 1) {
                        this.m_Type = GuideHand.TYPE_STAND;
                        this.Play();
                    }
                }
                break;
        }
    };
    GuideHand.prototype.SetTargetData = function (guideId, stepId, objParent, obj) {
        if (this.m_Target == obj) {
            if (this.m_Listener.ResetFunc) {
                this.m_Listener.ResetFunc(guideId, stepId);
            }
            return;
        }
        if (this.m_Target) {
            this.RemoveTargetEvent();
        }
        if (!this.m_Target) {
            this.m_ObjParent = objParent;
            this.AddTargetEvent(obj, guideId, stepId);
        }
    };
    GuideHand.prototype.ShowTarget = function (guildId, stepId, objParent, obj) {
        this.SetTargetData(guildId, stepId, objParent, obj);
        this.m_PosInvalid = true;
        this.m_Type = GuideHand.TYPE_STAND;
        this.Play();
    };
    GuideHand.prototype.MoveToTarget = function (guildId, stepId, objParent, obj) {
        this.SetTargetData(guildId, stepId, objParent, obj);
        this.m_PosInvalid = true;
        this.m_Type = GuideHand.TYPE_MOVE;
        this.Pause();
    };
    /////////////////////////////////////////////////////////////////////////////
    GuideHand.SPEED = 1100;
    GuideHand.TYPE_STAND = 0;
    GuideHand.TYPE_MOVE = 1;
    return GuideHand;
}(eui.Component));
__reflect(GuideHand.prototype, "GuideHand");
//# sourceMappingURL=GuideHand.js.map