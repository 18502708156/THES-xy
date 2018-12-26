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
var GameMapPanel = (function (_super) {
    __extends(GameMapPanel, _super);
    function GameMapPanel() {
        var _this = _super.call(this) || this;
        _this.m_ChildView = {};
        _this.leaveDlgStr = "是要退出副本？";
        _this.m_IsUpdate = false;
        _this.m_LastTime = 0;
        _this.skinName = "GameMapSkin";
        _this.m_Pos = _this.returnBtn.y;
        _this._AddClick(_this.helpBtn, _this._OnHelpClick);
        return _this;
    }
    GameMapPanel.prototype.SetHelpId = function (helpId) {
        this.mHelpId = helpId;
        if (!helpId) {
            this.helpBtn.visible = false;
            return;
        }
        this.helpBtn.visible = true;
    };
    GameMapPanel.prototype.OnOpen = function () {
        this.returnBtn.y = this.m_Pos;
        this.AddClick(this.returnBtn, this._OnClick);
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this._UpdateChatPos);
        this._UpdateChatPos();
    };
    GameMapPanel.prototype.OnClose = function () {
        this.ClearSelect();
        this.StopUpdate();
        this.mRaid = null;
        for (var key in this.m_ChildView) {
            var view = this.m_ChildView[key];
            DisplayUtils.removeFromParent(view);
            view.DoClose();
        }
        this.m_ChildView = {};
    };
    GameMapPanel.prototype.ShowRebornView = function (time, yb, func) {
        if (this.mRebornView) {
            this.mRebornView.SetData(time, yb, func);
            return;
        }
        var index = this.getChildIndex(this.group);
        this.mRebornView = new CommonFuHuoWin;
        this.addChildAt(this.mRebornView, index);
        this.mRebornView.SetData(time, yb, func);
    };
    GameMapPanel.prototype.RemoveRebornView = function () {
        if (!this.mRebornView) {
            return;
        }
        DisplayUtils.removeFromParent(this.mRebornView);
        this.mRebornView = null;
    };
    GameMapPanel.prototype.SetReturnBtn = function (y) {
        this.returnBtn.y = y;
    };
    GameMapPanel.prototype._UpdateChatPos = function () {
        this.globalToLocal(0, MiniChatPanel.POS, egret.$TempPoint);
        this.group.y = egret.$TempPoint.y;
    };
    GameMapPanel.prototype.AddChildBaseView = function (view) {
        if (!view) {
            return;
        }
        this.m_ChildView[view.hashCode] = view;
        this.addChildAt(view, 0);
        view.percentWidth = 100;
        view.percentHeight = 100;
        view.DoOpen(null);
    };
    GameMapPanel.prototype._OnHelpClick = function () {
        if (this.mHelpId) {
            ViewManager.ins().open(ActivityDescPanel, this.mHelpId);
        }
    };
    GameMapPanel.prototype._OnClick = function () {
        this.OnClickExitRaid();
    };
    GameMapPanel.prototype.setOnLeaveDlgStr = function (str) {
        this.leaveDlgStr = str;
    };
    GameMapPanel.prototype.OnClickExitRaid = function () {
        WarnWin.show(this.leaveDlgStr, function () {
            GameGlobal.CommonRaidModel.MapLeave();
        }, this);
    };
    GameMapPanel.prototype.showReturnBtn = function (val) {
        this.group.visible = val;
    };
    GameMapPanel.prototype.SetSelect = function (handle) {
        if (!handle) {
            this.ClearSelect();
            return;
        }
        if (!this.m_SelectView) {
            this.m_SelectView = new GameMapEntitySelectView;
            this.m_SelectView.addEventListener("ATK", this._OnAtk, this);
            this.m_SelectView.addEventListener("CANCEL", this._OnCancel, this);
        }
        this.addChildAt(this.m_SelectView, 0);
        this.m_SelectView.mHandle = handle;
        this.StartUpdate();
    };
    GameMapPanel.prototype.ClearSelectEntity = function (handle) {
        if (this.m_SelectView && this.m_SelectView.mHandle == handle) {
            this.ClearSelect();
        }
    };
    GameMapPanel.prototype.ClearSelect = function () {
        if (this.m_SelectView) {
            DisplayUtils.removeFromParent(this.m_SelectView);
            this.m_SelectView.mHandle = 0;
        }
    };
    GameMapPanel.prototype._OnAtk = function () {
        if (!this.m_SelectView) {
            return;
        }
        var handle = this.m_SelectView.mHandle;
        if (!handle) {
            return;
        }
        if (!this.mRaid) {
            return;
        }
        this.mRaid.OnEntityClick(handle);
        this.ClearSelect();
    };
    GameMapPanel.prototype._OnCancel = function () {
        this.ClearSelect();
    };
    GameMapPanel.prototype.StartUpdate = function () {
        if (this.m_IsUpdate) {
            return;
        }
        this.m_IsUpdate = true;
        this.m_LastTime = egret.getTimer();
        egret.startTick(this.Update, this);
    };
    GameMapPanel.prototype.StopUpdate = function () {
        if (!this.m_IsUpdate) {
            return false;
        }
        this.m_IsUpdate = false;
        egret.stopTick(this.Update, this);
    };
    GameMapPanel.prototype.Update = function (timeStamp) {
        if (!this.mRaid) {
            return;
        }
        if (!this.m_SelectView || !this.m_SelectView.mHandle) {
            this.StopUpdate();
        }
        else {
            var entity = this.mRaid.GetEntity(this.m_SelectView.mHandle);
            if (!entity) {
                this.ClearSelect();
                this.StopUpdate();
            }
            else {
                var pos = DisplayUtils.ConvertPos(entity, this);
                this.m_SelectView.x = pos.x;
                this.m_SelectView.y = pos.y;
            }
        }
        return false;
    };
    GameMapPanel.LAYER_LEVEL = LayerManager.UI_GAME_MAP;
    return GameMapPanel;
}(BaseEuiView));
__reflect(GameMapPanel.prototype, "GameMapPanel");
var GameMapEntitySelectView = (function (_super) {
    __extends(GameMapEntitySelectView, _super);
    function GameMapEntitySelectView() {
        var _this = _super.call(this) || this;
        _this.Init();
        return _this;
    }
    GameMapEntitySelectView.prototype.Init = function () {
        this.atk = new eui.Image();
        this.atk.source = "ui_hddt_bt_tiaozhan";
        this.atk.x = -100;
        this.atk.y = -50;
        this.quXiao = new eui.Image();
        this.quXiao.source = "ui_hddt_bt_quxiao";
        this.quXiao.x = 0;
        this.quXiao.y = -50;
        this.addChild(this.atk);
        this.addChild(this.quXiao);
        this.atk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
        this.quXiao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
    };
    GameMapEntitySelectView.prototype.OnClick = function (e) {
        switch (e.currentTarget) {
            case this.atk:
                this.dispatchEventWith("ATK");
                break;
            case this.quXiao:
                this.dispatchEventWith("CANCEL");
                break;
        }
    };
    return GameMapEntitySelectView;
}(egret.DisplayObjectContainer));
__reflect(GameMapEntitySelectView.prototype, "GameMapEntitySelectView");
//# sourceMappingURL=GameMapPanel.js.map