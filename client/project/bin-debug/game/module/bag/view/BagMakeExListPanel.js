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
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/2 14:11
 * @meaning: 熔炼额外界面listpanel
 *
 **/
var BagMakeExListPanel = (function (_super) {
    __extends(BagMakeExListPanel, _super);
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function BagMakeExListPanel() {
        var _this = _super.call(this) || this;
        _this.tList = [];
        _this.skinName = "BagMakeListSkin";
        _this._mails = [];
        _this.listView.itemRenderer = BagMakeExItem;
        return _this;
    }
    BagMakeExListPanel.prototype.OnOpen = function () {
        this.allReceiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent);
        this.observe(MessageDef.BAG_DEAL_SMELT, this.UpdateContent);
        this.UpdateContent();
    };
    BagMakeExListPanel.prototype.OnClose = function () {
        this.allReceiveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        GameGlobal.MessageCenter.removeListener(MessageDef.CHANGE_ITEM, this.UpdateContent, this);
    };
    BagMakeExListPanel.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.allReceiveBtn:
                var idx = this.tList;
                var tSmelt = [];
                for (var item in this.tList) {
                    if (this.tList[item].select) {
                        tSmelt.push(this.tList[item]);
                    }
                }
                if (tSmelt.length) {
                    UserEquip.ins().sendSmeltEquip(tSmelt);
                }
                else {
                    UserTips.ins().showTips("请勾选熔炼装备");
                }
        }
    };
    BagMakeExListPanel.prototype.UpdateContent = function () {
        var list = UserBag.ins().getBagSortQualityEquips(5, 0, 1);
        var weight = function (config) {
            return config.itemConfig.quality;
        };
        list.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.tList = [];
        for (var i = 0; i < 12; i++) {
            if (list[i])
                this.tList.push(list[i]);
        }
        this.listView.dataProvider = new eui.ArrayCollection(this.tList);
    };
    BagMakeExListPanel.NAME = "熔炼";
    return BagMakeExListPanel;
}(BaseView));
__reflect(BagMakeExListPanel.prototype, "BagMakeExListPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=BagMakeExListPanel.js.map