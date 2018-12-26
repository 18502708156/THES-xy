/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/27 18:51
 * @meaning: 灵童命格分解详情item
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
var DestinyResolveItem = (function (_super) {
    __extends(DestinyResolveItem, _super);
    function DestinyResolveItem() {
        var _this = _super.call(this) || this;
        _this._totalNum = 0;
        // 皮肤名称
        _this.skinName = "DestinyResolveItemSkin";
        // //点击响应
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
        _this.countTxt.addEventListener(egret.Event.CHANGE, _this.onTxtChange, _this);
        _this.decBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        _this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        _this.imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        _this.imgAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    DestinyResolveItem.prototype.PlayEff = function () {
        UIHelper.PlayBoomEff(this.effGroup);
    };
    DestinyResolveItem.prototype.dataChanged = function () {
        if (this.data) {
            this.currentState = "item";
            if (this.data.itemConfig.name) {
                this.lbNe.text = this.data.itemConfig.name;
                this.lbNe.textColor = ItemBase.QUALITY_COLOR[this.data.itemConfig.quality];
            }
            this._totalNum = this.data.count || 0;
            this.item.num = this.data.count;
            this.item.setDataByConfig(this.data.itemConfig);
            var arrCon = GlobalConfig.ins().DestinyAttrsConfig[this.data.configID];
            var soConfig = GlobalConfig.ins().DestinyResolveConfig[arrCon.type][arrCon.level - 1];
            var nums = 1;
            var strTi = "";
            if (soConfig) {
                nums = soConfig.resolvestar || soConfig.resolvecoin;
                strTi = soConfig.resolvestar ? "碎片: " : "银两: ";
            }
            this.lbInfo.text = strTi + CommonUtils.overLength(this.data.count * nums);
            this.countTxt.text = this.data.count || 0;
        }
        else {
            this.currentState = "add";
        }
    };
    DestinyResolveItem.prototype.onTxtChange = function (e) {
        var num = Number(this.countTxt.text);
        this.setTotalPrice(num);
    };
    ;
    DestinyResolveItem.prototype.setTotalPrice = function (num) {
        var nMaxNum = UserBag.ins().getBagGoodsByHandle(UserBag.BAG_TYPE_ASTROLABE, this.data.handle).count;
        if (num < nMaxNum) {
            this._totalNum = num;
        }
        else {
            this._totalNum = nMaxNum;
        }
        if (this._totalNum < 1)
            (this._totalNum = 1);
        this.data.count = this._totalNum;
        this.countTxt.text = this._totalNum + "";
    };
    ;
    DestinyResolveItem.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.decBtn:
                this.setTotalPrice(this._totalNum - 1);
                break;
            case this.addBtn:
                this.setTotalPrice(this._totalNum + 1);
                break;
            case this.imgBg:
                if (this.currentState == "add") {
                    ViewManager.ins().open(DestinyResolvelHandleLayer);
                }
                break;
            case this.imgAdd:
                if (this.currentState == "add") {
                    ViewManager.ins().open(DestinyResolvelHandleLayer);
                }
                break;
        }
    };
    return DestinyResolveItem;
}(eui.ItemRenderer));
__reflect(DestinyResolveItem.prototype, "DestinyResolveItem");
//# sourceMappingURL=DestinyResolveItem.js.map