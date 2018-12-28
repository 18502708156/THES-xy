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
var WarnWin = (function (_super) {
    __extends(WarnWin, _super);
    function WarnWin() {
        var _this = _super.call(this) || this;
        _this.closeExecuteCallFun2 = true;
        return _this;
    }
    // normal sure
    WarnWin.show = function (str, func, thisObj, func2, thisObj2, statu, data) {
        if (func2 === void 0) { func2 = null; }
        if (thisObj2 === void 0) { thisObj2 = null; }
        if (statu === void 0) { statu = "normal"; }
        if (data === void 0) { data = null; }
        UserWarn.ins().setWarnLabel(str, {
            "func": func,
            "thisObj": thisObj
        }, {
            "func": func2,
            "thisObj": thisObj2,
        }, statu, data);
    };
    ;
    WarnWin.ShowContent = function (str, func, thisObj, func2, thisObj2, statu, data) {
        if (func2 === void 0) { func2 = null; }
        if (thisObj2 === void 0) { thisObj2 = null; }
        if (statu === void 0) { statu = "normal"; }
        if (data === void 0) { data = null; }
        UserWarn.ins().setWarnContent(str, {
            "func": func,
            "thisObj": thisObj
        }, {
            "func": func2,
            "thisObj": thisObj2,
        }, statu, data);
    };
    // normal sure
    WarnWin.showReward = function (str, func, thisObj, func2, thisObj2, statu, data) {
        if (func2 === void 0) { func2 = null; }
        if (thisObj2 === void 0) { thisObj2 = null; }
        if (statu === void 0) { statu = "reward"; }
        if (data === void 0) { data = null; }
        UserWarn.ins().setshowReward(str, {
            "func": func,
            "thisObj": thisObj
        }, {
            "func": func2,
            "thisObj": thisObj2,
        }, statu, data);
    };
    ;
    // checkBox
    WarnWin.showCheckBox = function (name, str, func, thisObj, func2, thisObj2, statu, data) {
        if (func2 === void 0) { func2 = null; }
        if (thisObj2 === void 0) { thisObj2 = null; }
        if (statu === void 0) { statu = "checkBox"; }
        if (data === void 0) { data = null; }
        UserWarn.ins().setshowCheckBox(name, str, {
            "func": func,
            "thisObj": thisObj
        }, {
            "func": func2,
            "thisObj": thisObj2,
        }, statu, data);
    };
    ;
    WarnWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "warnFrameSkin";
        this.validateNow();
    };
    WarnWin.prototype.OnOpen = function () {
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false); //不显示返回按钮
        this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.notBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.animGroup.scaleX = this.animGroup.scaleY = 0.5;
        this.animGroup.alpha = 0;
        egret.Tween.get(this.animGroup).to({
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        }, 200, egret.Ease.backOut);
    };
    WarnWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.notBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.callBack = null;
        this.calback2 = null;
        egret.Tween.removeTweens(this.animGroup);
    };
    ;
    WarnWin.prototype.onTap = function (e) {
        var tempCb1 = this.callBack;
        var tempCb2 = this.calback2;
        switch (e.currentTarget) {
            case this.sureBtn:
                WarnWinDate.ins().changeHint(this.name, !this.checkBox.selected);
                if (tempCb1 && tempCb1.func != null)
                    tempCb1.func.call(tempCb1.thisObj);
                break;
            case this.notBtn:
                if (tempCb2 && tempCb2.func) {
                    tempCb2.func.call(tempCb2.thisObj);
                }
                break;
        }
        this.CloseSelf();
    };
    Object.defineProperty(WarnWin.prototype, "isShowWin", {
        get: function () {
            return this._isShowWin;
        },
        set: function (bool) {
            if (this._isShowWin == bool)
                return;
            this._isShowWin = bool;
        },
        enumerable: true,
        configurable: true
    });
    // private _Adjust(height: number): void {
    // 	this.bg.height = Math.max(height + 30, this.tempH3)
    // 	this.commonDialog.height = this.bg.height + this.tempH
    // 	this.validateNow()
    // 	let pos = this.commonDialog.y + this.commonDialog.height - this.tempH2
    // 	this.sureBtn.y = pos
    // 	this.notBtn.y = pos
    // }
    WarnWin.prototype._Adjust = function (height) {
        var h = Math.max(height + 40, 187);
        this.group.height = h + 143;
        this.commonDialog.height = this.group.height + 30;
    };
    // private _UpdateBtn() {
    // 	let str = this.sureBtn.label || ""
    // 	if (str.length > 4) {
    // 		this.sureBtn.width = str.length * 40
    // 	}
    // }
    WarnWin.prototype.setWarnLabel = function (str, callbackFunc, calbackFun2, statu, data) {
        if (calbackFun2 === void 0) { calbackFun2 = null; }
        if (statu === void 0) { statu = "normal"; }
        if (data === void 0) { data = null; }
        if (typeof (str) == "string") {
            this.warnLabel.textFlow = TextFlowMaker.generateTextFlow(str);
        }
        else {
            this.warnLabel.textFlow = str;
        }
        this.callBack = callbackFunc;
        this.calback2 = calbackFun2;
        this.currentState = statu;
        if (data) {
            if (data.btnName) {
                this.sureBtn.label = data.btnName;
                // this._UpdateBtn()
            }
            if (data.btnName2) {
                this.notBtn.label = data.btnName2;
            }
            if (data.title) {
                this.commonDialog.title = data.title;
            }
            if (data.closeExecuteCallFun2 != null)
                this.closeExecuteCallFun2 = data.closeExecuteCallFun2;
        }
        this.hideReturnBtn(); //隐藏取消按钮
        this._Adjust(this.warnLabel.height);
        this.CommonDialogCloseCallFun();
    };
    ;
    WarnWin.prototype.setWarnContent = function (content, callbackFunc, calbackFun2, statu, data) {
        if (calbackFun2 === void 0) { calbackFun2 = null; }
        if (statu === void 0) { statu = "normal"; }
        if (data === void 0) { data = null; }
        this.warnLabel.visible = false;
        this.callBack = callbackFunc;
        this.calback2 = calbackFun2;
        this.currentState = statu;
        if (data) {
            if (data.btnName) {
                this.sureBtn.label = data.btnName;
                // this._UpdateBtn()
            }
            if (data.title) {
                this.commonDialog.title = data.title;
            }
        }
        var comp = null;
        if (typeof (content) == "string") {
            comp = new eui.Component;
            comp.skinName = content;
        }
        else {
            comp = content;
        }
        this.group.addChild(comp);
        this._Adjust(comp.height);
        comp.x = (StageUtils.WIDTH - comp.width) * 0.5;
        comp.y = (this.group.height - comp.height) >> 1;
        this.CommonDialogCloseCallFun();
        //取消按钮按需添加,根据后面需求
    };
    WarnWin.prototype.setshowReward = function (str, callbackFunc, calbackFun2, statu, data) {
        if (calbackFun2 === void 0) { calbackFun2 = null; }
        if (statu === void 0) { statu = "reward"; }
        if (data === void 0) { data = null; }
        if (typeof (str) == "string") {
            this.warnLabel.textFlow = TextFlowMaker.generateTextFlow(str);
        }
        else {
            this.warnLabel.textFlow = str;
        }
        this.callBack = callbackFunc;
        this.calback2 = calbackFun2;
        this.currentState = statu;
        if (data) {
            if (data.btnName) {
                this.sureBtn.label = data.btnName;
                // this._UpdateBtn()
            }
            if (data.title) {
                this.commonDialog.title = data.title;
            }
            //奖励内容
            if (data.reward) {
                this.itemList.itemRenderer = ItemBase;
                this.itemList.dataProvider = new eui.ArrayCollection(data.reward);
            }
            if (data.bHideSureBtn) {
                this.sureBtn.visible = false;
            }
        }
        this.CommonDialogCloseCallFun();
    };
    ;
    WarnWin.prototype.setshowCheckBox = function (name, str, callbackFunc, calbackFun2, statu, data) {
        if (calbackFun2 === void 0) { calbackFun2 = null; }
        if (statu === void 0) { statu = "checkBox"; }
        if (data === void 0) { data = null; }
        if (typeof (str) == "string") {
            this.warnLabel.textFlow = TextFlowMaker.generateTextFlow(str);
        }
        else {
            this.warnLabel.textFlow = str;
        }
        this.callBack = callbackFunc;
        this.calback2 = calbackFun2;
        this.currentState = statu;
        this.name = name;
        if (data) {
            if (data.btnName) {
                this.sureBtn.label = data.btnName;
                // this._UpdateBtn()
            }
            if (data.title) {
                this.commonDialog.title = data.title;
            }
            //奖励内容
            if (data.reward) {
                this.itemList.itemRenderer = ItemBase;
                this.itemList.dataProvider = new eui.ArrayCollection(data.reward);
            }
            if (data.bHideSureBtn) {
                this.sureBtn.visible = false;
            }
        }
        this.CommonDialogCloseCallFun();
    };
    ;
    WarnWin.prototype.CommonDialogCloseCallFun = function () {
        var _this = this;
        this.commonDialog.mCallback = function () {
            if (_this.calback2 && _this.calback2.func && _this.closeExecuteCallFun2) {
                _this.calback2.func.call(_this.calback2.thisObj);
            }
            _this.CloseSelf();
        };
    };
    WarnWin.prototype.hideReturnBtn = function () {
        if (!this.calback2) {
            //只用一个按钮
            this.sureBtn.x = this.width / 2 - this.sureBtn.width / 2; //重置一下按钮的位置
            this.notBtn.visible = false;
        }
    };
    return WarnWin;
}(BaseEuiView));
__reflect(WarnWin.prototype, "WarnWin");
WarnWin.LAYER_LEVEL = LayerManager.UI_Popup;
//# sourceMappingURL=WarnWin.js.map