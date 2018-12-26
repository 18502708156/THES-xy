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
// 动作加载数据
var BattleMvData = (function (_super) {
    __extends(BattleMvData, _super);
    function BattleMvData(context, hide) {
        if (hide === void 0) { hide = false; }
        var _this = _super.call(this) || this;
        // 只显示的方向
        // private static mWay: {[key: number]: boolean} = {[3]: true, [5]: true}
        _this.offset = null;
        _this.job = null;
        _this.sex = null;
        _this.mIsShow = true;
        _this.mIsPlayWayAnim = false;
        // 不添加方向动作状态
        _this.m_NotState = false;
        _this.m_Context = context;
        if (hide && _this.mv) {
            _this.mv.visible = false;
        }
        return _this;
    }
    // 显示的模型名称
    BattleMvData.prototype.GetName = function () {
        if (this.replaceName) {
            return this.replaceName;
        }
        return this.name;
    };
    BattleMvData.prototype.GetClipName = function () {
        var anim = this.m_Context.GetClipType();
        if (this.mAnimType) {
            if (!this.mAnimType[anim]) {
                anim = EntityClipType.STAND;
            }
        }
        if (!this.replaceName && this.ride) {
            anim = 100 + anim;
        }
        return anim;
    };
    BattleMvData.prototype.SetNotState = function () {
        this.m_NotState = true;
        if (this.mv) {
            this.mv.m_LoadAndPlay = false;
        }
    };
    BattleMvData.prototype.SetOffset = function (offset) {
        if (this.mv) {
            this.mv.x = offset.x;
            this.mv.y = offset.y;
        }
        else {
            this.offset = offset;
        }
    };
    BattleMvData.prototype.UpdateSetting = function (settingId) {
        if (this.mSettingId == settingId) {
            if (this.mv) {
                this.mv.visible = this.IsSettingShow();
            }
        }
    };
    BattleMvData.prototype.IsSettingShow = function () {
        if (this.mSettingId) {
            return !FuncOpenModel.HasSaveData(this.mSettingId);
        }
        return true;
    };
    BattleMvData.prototype.Init = function () {
        this.replaceName = null;
        this.mIsShow = true;
        this.mIsPlayWayAnim = false;
    };
    BattleMvData.prototype.SetParent = function (parent, index) {
        this.mParent = parent;
        this.mIndex = index;
    };
    BattleMvData.prototype.AddToParent = function () {
        if (!this.mParent) {
            console.log("not parent");
            return;
        }
        if (!this.mv) {
            return;
        }
        this.mParent.addChildAt(this.mv, this.mIndex || 0);
    };
    BattleMvData.prototype.Create = function () {
        this.mv = new EntityMovieObject;
        this.mv.$hashCode = this.hashCode;
        if (this.offset) {
            this.mv.x = this.offset.x;
            this.mv.y = this.offset.y;
            this.offset = null;
        }
    };
    BattleMvData.prototype.SetId = function (appId) {
        if (appId) {
            this.name = AppearanceConfig.GetAppe(appId, this.job, this.sex);
            // if (this.mIsHead) {
            // 	this.name += "_h"
            // }
        }
        else {
            this.name = null;
            if (this.mv) {
                this.mv.visible = false;
                this.mv.stop();
            }
        }
    };
    BattleMvData.prototype.Load = function () {
        if (!this.mIsShow) {
            return;
        }
        var res = this.GetName();
        var mc = this.mv;
        if (res) {
            if (mc) {
                mc.stop();
            }
            if (this.mSettingId != null) {
                // 不显示该对象
                if (FuncOpenModel.HasSaveData(this.mSettingId)) {
                    return;
                }
            }
            if (this.mIsHead) {
                var hasHead = false;
                var data = GameGlobal.Config.AppearancePosConfig[this.name];
                if (data) {
                    var dir = this.m_Context.GetDir();
                    if (dir < 2 || dir > 6) {
                        hasHead = data.upRes;
                    }
                    else {
                        hasHead = data.downRes;
                    }
                }
                if (!hasHead) {
                    res = null;
                    if (this.mv) {
                        if (this.mv.visible) {
                            this.mv.visible = false;
                            this.mv.stop();
                        }
                    }
                }
                else {
                    if (this.mv) {
                        this.mv.visible = true;
                    }
                    res += "_h";
                }
            }
            if (!res) {
                return;
            }
            if (!mc) {
                this.Create();
                mc = this.mv;
                mc.addEventListener(egret.Event.CHANGE, this.SyncFrame, this);
                if (this.m_NotState) {
                    this.mv.m_LoadAndPlay = false;
                }
            }
            if (!mc.parent) {
                this.mParent.addChildAt(this.mv, this.mIndex);
            }
            if (this.m_NotState) {
                this.m_Context.LoadMcAnim(mc, res, null, null);
            }
            else {
                this.m_Context.LoadMcAnim(mc, res, this.m_Context.GetDir(), this.GetClipName());
            }
        }
    };
    BattleMvData.prototype.SyncFrame = function (e) {
        var mc = e.currentTarget;
        if (mc.movieClipData.$isDataValid() && this.m_Context.mBody.mv) {
            mc.gotoAndPlay(this.m_Context.mBody.mv.currentFrame, this.m_Context.GetPlayCount());
        }
    };
    BattleMvData.prototype.SetShowState = function (isShow) {
        this.mIsShow = isShow;
        if (!this.mv) {
            return;
        }
        var mv = this.mv;
        if (isShow) {
            if (!mv.parent) {
                this.AddToParent();
            }
        }
        else {
            if (mv.parent) {
                DisplayUtils.removeFromParent(mv);
            }
        }
    };
    BattleMvData.prototype.ClearCache = function () {
        if (this.mv) {
            this.mv.ClearCache();
        }
    };
    BattleMvData.prototype.UpdateWayTween = function () {
        var dir = this.m_Context.GetDir();
        var mv = this.mv;
        if (!mv) {
            return;
        }
        var x;
        var y;
        if (dir > 4) {
            if (!this.m_NotState) {
                this.mv.scaleX = -1;
            }
            x = 100;
            y = -100;
        }
        else {
            if (!this.m_NotState) {
                this.mv.scaleX = 1;
            }
            x = -100;
            y = -100;
        }
        if (dir <= 2 || dir >= 6) {
            y += 40;
        }
        if (this.mIsPlayWayAnim && mv.$stage) {
            if (mv.x != x || mv.y != y) {
                egret.Tween.removeTweens(mv);
                egret.Tween.get(mv).to({
                    x: x,
                    y: y,
                }, 1300, egret.Ease.sineOut);
            }
        }
        else {
            mv.x = x;
            mv.y = y;
            this.mIsPlayWayAnim = true;
        }
    };
    return BattleMvData;
}(egret.HashObject));
__reflect(BattleMvData.prototype, "BattleMvData");
//# sourceMappingURL=BattleMvData.js.map