/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/3/29 星期四 11:57
 * @meaning: 中等对话框
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
var CommonMiddleDialog = (function (_super) {
    __extends(CommonMiddleDialog, _super);
    function CommonMiddleDialog() {
        return _super.call(this) || this;
    }
    Object.defineProperty(CommonMiddleDialog.prototype, "hideBtn", {
        set: function (value) {
            this.m_HideBtn = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonMiddleDialog.prototype, "topBtn", {
        set: function (value) {
            this.m_TopBtn = true;
        },
        enumerable: true,
        configurable: true
    });
    CommonMiddleDialog.prototype.SetReturnButton = function (btn) {
        if (!btn) {
            if (this.cacheReturnBtn) {
                this.btnReturn = this.cacheReturnBtn;
                this.btnReturn.visible = true;
                this.cacheReturnBtn = null;
            }
            return;
        }
        if (this.btnReturn) {
            this.cacheReturnBtn = this.btnReturn;
            this.btnReturn.visible = false;
        }
        this.btnReturn = btn;
    };
    CommonMiddleDialog.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    CommonMiddleDialog.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        if (this.m_HideBtn) {
            this.btnClose.visible = false;
        }
        if (this.m_TopBtn && this.parent) {
            this.m_TempTimer = Timer.TimeOut(function () {
                DisplayUtils.SetParent(_this.btnReturn, _this.parent);
            }, 50);
        }
    };
    CommonMiddleDialog.prototype.OnAdded = function (target) {
        for (var _i = 0, _a = CommonMiddleDialog.SHOW_DIALOG_LIST; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item == this) {
                continue;
            }
            item.dialogMask.visible = false;
        }
        CommonMiddleDialog.SHOW_DIALOG_LIST.push(this);
        this.m_Target = target;
        if (this.btnClose) {
            this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
        if (this.btnReturn) {
            this.btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
        if (this.dialogMask)
            this.dialogMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    CommonMiddleDialog.prototype.OnRemoved = function () {
        for (var i = CommonMiddleDialog.SHOW_DIALOG_LIST.length - 1; i >= 0; --i) {
            var item = CommonMiddleDialog.SHOW_DIALOG_LIST[i];
            if (item == null || item == this) {
                CommonMiddleDialog.SHOW_DIALOG_LIST.splice(i, 1);
            }
            else {
                item.dialogMask.visible = true;
                break;
            }
        }
        if (this.btnReturn) {
            this.btnReturn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
        if (this.btnClose) {
            this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
        if (this.dialogMask)
            this.dialogMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        if (this.m_TempTimer) {
            this.m_TempTimer.Stop();
        }
    };
    CommonMiddleDialog.prototype._Close = function () {
        if (this.mCallback) {
            this.mCallback();
            return;
        }
        if (this.m_Target) {
            ViewManager.ins().close(this.m_Target);
        }
    };
    CommonMiddleDialog.prototype._OnClick = function (e) {
        if (this.btnReturn && e.currentTarget == this.btnReturn) {
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
            case this.btnClose:
                this._Close();
                break;
        }
    };
    CommonMiddleDialog.prototype.showReturnBtn = function (value) {
        this.btnReturn.visible = value;
    };
    CommonMiddleDialog.prototype.showCloseBtn = function (value) {
        this.btnClose.visible = value;
    };
    CommonMiddleDialog.SHOW_DIALOG_LIST = [];
    return CommonMiddleDialog;
}(eui.Component));
__reflect(CommonMiddleDialog.prototype, "CommonMiddleDialog", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=CommonMiddleDialog.js.map