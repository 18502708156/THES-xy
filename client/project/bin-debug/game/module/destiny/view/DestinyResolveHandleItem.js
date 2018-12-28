/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/4 21:51
 * @meaning: 灵童命格手动分解详情item
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
var DestinyResolveHandleItem = (function (_super) {
    __extends(DestinyResolveHandleItem, _super);
    function DestinyResolveHandleItem() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._totalNum = 0;
        // 皮肤名称
        _this.skinName = "DestinyResolveHandleItemSkin";
        // //点击响应
        _this.countTxt.addEventListener(egret.Event.CHANGE, _this.onTxtChange, _this);
        _this.decBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        _this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        _this.checkBox1.addEventListener(egret.Event.CHANGE, _this.chage, _this);
        return _this;
    }
    DestinyResolveHandleItem.prototype.dataChanged = function () {
        if (this.data) {
            if (this.data.itemConfig.name) {
                this.nameLabel.text = this.data.itemConfig.name;
                this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.data.itemConfig.quality];
            }
            this._totalNum = this.data.count || 0;
            this.itemIcon.setDataByConfig(this.data.itemConfig);
            this.itemIcon.setCount(this._totalNum);
            var arrCon = GlobalConfig.ins().DestinyAttrsConfig[this.data.configID];
            if (arrCon.attars) {
                this.lbFight.text = "战力+" + ItemConfig.CalcAttrScoreValue(arrCon.attars);
                if (arrCon.attars[0]) {
                    this.lbInfo0.text = AttributeData.getAttStrByType(arrCon.attars[0], 0, ": ", false, '#682f00');
                }
                else {
                    this.lbInfo0.text = "";
                }
                if (arrCon.attars[1]) {
                    this.lbInfo1.text = AttributeData.getAttStrByType(arrCon.attars[1], 0, ": ", false, '#682f00');
                }
                else {
                    this.lbInfo1.text = "";
                }
            }
            else {
                this.lbFight.text = "";
                this.lbInfo0.text = arrCon.skillName || "";
                this.lbInfo1.text = arrCon.desc || "";
            }
            this.countTxt.text = this.data.count || 0;
        }
    };
    DestinyResolveHandleItem.prototype.onTxtChange = function (e) {
        var num = Number(this.countTxt.text);
        this.setTotalPrice(num);
    };
    ;
    DestinyResolveHandleItem.prototype.setTotalPrice = function (num) {
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
    DestinyResolveHandleItem.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.decBtn:
                this.setTotalPrice(this._totalNum - 1);
                break;
            case this.addBtn:
                this.setTotalPrice(this._totalNum + 1);
                break;
        }
    };
    //点击选择框改变内容
    DestinyResolveHandleItem.prototype.chage = function () {
        this.data.bSelect = this.checkBox1.selected;
        //弹出提示
        if (this.data && this.data.itemConfig && (this.data.itemConfig.quality > 3) && this.data.bSelect) {
            if (GameGlobal.DestinyController.bShowResolveTip) {
                ViewManager.ins().open(TipByBox, null, GameGlobal.DestinyController.bShowResolveTip);
            }
        }
    };
    return DestinyResolveHandleItem;
}(eui.ItemRenderer));
__reflect(DestinyResolveHandleItem.prototype, "DestinyResolveHandleItem");
//# sourceMappingURL=DestinyResolveHandleItem.js.map