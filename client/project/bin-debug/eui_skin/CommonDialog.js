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
var CommonDialog = (function (_super) {
    __extends(CommonDialog, _super);
    function CommonDialog() {
        var _this = _super.call(this) || this;
        _this._Added = false;
        return _this;
    }
    Object.defineProperty(CommonDialog.prototype, "title", {
        set: function (value) {
            this.m_Title = value;
            this._UpdateTitle();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonDialog.prototype, "hideBtn", {
        set: function (value) {
            this.m_HideBtn = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonDialog.prototype, "topBtn", {
        set: function (value) {
            this.m_TopBtn = true;
        },
        enumerable: true,
        configurable: true
    });
    CommonDialog.prototype.setBgVisible = function (_bVisibale) {
        this.imgBg.visible = _bVisibale;
    };
    CommonDialog.prototype._UpdateTitle = function () {
        if (this.titleLabel && this.m_Title && this.$stage) {
            this.titleLabel.text = this.m_Title;
        }
    };
    CommonDialog.prototype.SetReturnButton = function (btn) {
        if (!btn) {
            if (this.cacheReturnBtn) {
                this.dialogReturnBtn = this.cacheReturnBtn;
                this.dialogReturnBtn.visible = true;
                this.cacheReturnBtn = null;
            }
            return;
        }
        if (this.dialogReturnBtn) {
            this.cacheReturnBtn = this.dialogReturnBtn;
            this.dialogReturnBtn.visible = false;
        }
        this.dialogReturnBtn = btn;
    };
    CommonDialog.prototype.$setParent = function (parent) {
        var ret = _super.prototype.$setParent.call(this, parent);
        if (ret && parent) {
            var view = Util.GetParentByType(parent, BaseEuiView);
            if (view) {
                view.mDialog = this;
            }
        }
        return ret;
    };
    CommonDialog.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    CommonDialog.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this._UpdateTitle();
        if (this.m_HideBtn) {
            this.dialogCloseBtn.visible = false;
        }
        if (this.m_TopBtn && this.parent) {
            this.m_TempTimer = Timer.TimeOut(function () {
                DisplayUtils.SetParent(_this.dialogReturnBtn, _this.parent);
            }, 50);
        }
    };
    CommonDialog.prototype.OnAdded = function (target) {
        this._Added = true;
        for (var _i = 0, _a = CommonDialog.SHOW_DIALOG_LIST; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item == this) {
                continue;
            }
            item.dialogMask.visible = false;
        }
        CommonDialog.SHOW_DIALOG_LIST.push(this);
        this.m_Target = target;
        if (this.dialogCloseBtn) {
            this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
        if (this.dialogReturnBtn) {
            this.dialogReturnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
        if (this.dialogMask)
            this.dialogMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    CommonDialog.prototype.OnRemoved = function () {
        if (!this._Added) {
            return;
        }
        this._Added = false;
        for (var i = CommonDialog.SHOW_DIALOG_LIST.length - 1; i >= 0; --i) {
            var item = CommonDialog.SHOW_DIALOG_LIST[i];
            if (item == null || item == this) {
                CommonDialog.SHOW_DIALOG_LIST.splice(i, 1);
            }
            else {
                item.dialogMask.visible = true;
                break;
            }
        }
        if (this.dialogReturnBtn) {
            this.dialogReturnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
        if (this.dialogCloseBtn) {
            this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
        if (this.dialogMask)
            this.dialogMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        if (this.m_TempTimer) {
            this.m_TempTimer.Stop();
        }
    };
    CommonDialog.prototype._Close = function () {
        if (this.mCallback) {
            this.mCallback();
            return;
        }
        if (this.m_Target) {
            ViewManager.ins().close(this.m_Target);
        }
    };
    CommonDialog.prototype._OnClick = function (e) {
        if (this.dialogReturnBtn && e.currentTarget == this.dialogReturnBtn) {
            this._Close();
        }
        if (this.m_HideBtn) {
            return;
        }
        switch (e.currentTarget) {
            case this.dialogMask:
                if (this.notClickMask) {
                    break;
                }
            case this.dialogCloseBtn:
                this._Close();
                break;
        }
    };
    CommonDialog.prototype.showReturnBtn = function (value) {
        if (this.dialogReturnBtn) {
            this.dialogReturnBtn.visible = value;
        }
    };
    CommonDialog.prototype.showCloseBtn = function (value) {
        this.dialogCloseBtn.visible = value;
    };
    /**增加一个放在返回按钮下面的 UI */
    CommonDialog.prototype.addCustomImgBg = function (value) {
        this.addChildAt(value, this.getChildIndex(this.dialogReturnBtn));
    };
    CommonDialog.SHOW_DIALOG_LIST = [];
    return CommonDialog;
}(eui.Component));
__reflect(CommonDialog.prototype, "CommonDialog", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=CommonDialog.js.map