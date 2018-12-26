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
var SmeltSelectWin = (function (_super) {
    __extends(SmeltSelectWin, _super);
    function SmeltSelectWin() {
        return _super.call(this) || this;
    }
    SmeltSelectWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "SmeltSelectSkin";
        this.itemList.itemRenderer = SmeltSelectItem;
        this.itemScroller.viewport = this.itemList;
        this.checkList = [];
    };
    ;
    SmeltSelectWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.len = param[1];
        // this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        // this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.itemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
        this.itemList.dataProvider = new eui.ArrayCollection(param[0]);
        this.setSmeltEquipList(param[2]);
    };
    ;
    SmeltSelectWin.prototype.OnClose = function () {
        // this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        // this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.itemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
        this.foolChecklist();
        MessageCenter.ins().removeAll(this);
        GameGlobal.MessageCenter.dispatch(MessageDef.postEquipCheckList, this.checkList);
    };
    ;
    SmeltSelectWin.prototype.onItemTap = function (e) {
        var item = e.itemRenderer;
        if (!item.checkBoxs.selected && this.checkList.length >= this.len)
            return;
        item.checkBoxs.selected = !item.checkBoxs.selected;
        var itemData = this.itemList.selectedItem;
        if (item.checkBoxs.selected) {
            this.checkList[this.checkList.length] = itemData;
            if (this.checkList.length == this.len) {
                GameGlobal.MessageCenter.dispatch(MessageDef.postEquipCheckList, this.checkList);
                ViewManager.ins().close(SmeltSelectWin);
                return;
            }
        }
        else {
            var index = this.checkList.indexOf(itemData);
            if (index < 0)
                return;
            this.checkList.splice(index, 1);
        }
        this.setCountLabel(this.checkList.length);
    };
    ;
    SmeltSelectWin.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            // case this.closeBtn:
            // case this.closeBtn0:
            // 	ViewManager.ins().close(SmeltSelectWin);
            // 	break;
            case this.sureBtn:
                GameGlobal.MessageCenter.dispatch(MessageDef.postEquipCheckList, this.checkList);
                ViewManager.ins().close(SmeltSelectWin);
                break;
        }
    };
    ;
    SmeltSelectWin.prototype.setSmeltEquipList = function (list) {
        var _this = this;
        this.checkList = list;
        this.checkListData();
        this.setCountLabel(this.checkList.length);
        TimerManager.ins().doFrame(60, 1, function () {
            // egret.callLater(()=>{
            for (var i = 0; i < _this.checkList.length; i++) {
                for (var j = 0; j < _this.itemList.numElements; j++) {
                    var item = _this.itemList.getElementAt(j);
                    if (_this.checkList[i] && _this.checkList[i].handle == item.data.handle) {
                        if (_this.checkList.length <= _this.len) {
                            _this.checkList[i] = item.data;
                            item.checkBoxs.selected = true;
                        }
                        break;
                    }
                }
            }
            // }, this)
        }, this);
    };
    ;
    SmeltSelectWin.prototype.setCountLabel = function (count) {
        this.countLabel.text = count + "/" + this.len;
    };
    ;
    SmeltSelectWin.prototype.checkListData = function () {
        var len = this.checkList.length;
        for (var i = len - 1; i >= 0; i--) {
            if (this.checkList[i] == null) {
                this.checkList.splice(i, 1);
            }
        }
    };
    ;
    SmeltSelectWin.prototype.foolChecklist = function () {
        var len = this.checkList.length;
        for (var i = 0; i < this.len; i++) {
            if (i >= len) {
                this.checkList.push(null);
            }
        }
    };
    ;
    SmeltSelectWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return SmeltSelectWin;
}(BaseEuiView));
__reflect(SmeltSelectWin.prototype, "SmeltSelectWin");
//# sourceMappingURL=SmeltSelectWin.js.map