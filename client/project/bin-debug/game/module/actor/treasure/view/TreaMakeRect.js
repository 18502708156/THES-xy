/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 15:01
 * @meaning: 法宝打造框详情
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
//打造的信息框
var TreaMakeRect = (function (_super) {
    __extends(TreaMakeRect, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TreaMakeRect() {
        var _this = _super.call(this) || this;
        _this.lId = 0;
        _this.rId = 0;
        _this.nType = 0;
        _this.skinName = "TreasureMakeRectSkin";
        _this.listView.itemRenderer = ItemBaseCost;
        _this._AddClick(_this.btnBuild, _this.onClick);
        _this._AddClick(_this.lNe, _this.onClick);
        _this._AddClick(_this.rNe, _this.onClick);
        _this.mRoleSendCheckData = new RoleSendCheckData(function (type) {
            GameGlobal.TreasureModel.sendSpellsResMake(_this.nType, type);
        }, function () {
            var config = GlobalConfig.ins().SpellsResMakeConfig[_this.nType];
            if (config) {
                var cost = config.cost;
                return [3, 0, cost[0].id, cost[0].count]; //因为不消耗钱币,所以,第一二个参数都是模拟为了可以继续进行自动购买
            }
            return [null];
        }, function () {
            var bSelect = _this.checkBox.selected;
            return bSelect;
        });
        return _this;
    }
    TreaMakeRect.prototype._SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    TreaMakeRect.prototype.onUpdate = function (_type) {
        var pConfig = GlobalConfig.ins().SpellsResMakeConfig[_type];
        if (!pConfig)
            return;
        this.nType = _type;
        //普通打造
        if (this.nType === 1) {
            this.lbName.text = "普通打造";
            this.currentState = "normal";
            this.btnBuild.icon = "ui_fb_bt_putongdazao";
            var lNe = "";
            var rNe = "";
            for (var item in pConfig.cost) {
                if (pConfig.cost[item].id) {
                    if (item == "0") {
                        this.lId = pConfig.cost[item].id;
                        lNe = GameGlobal.Config.ItemConfig[pConfig.cost[item].id].name || "";
                    }
                    else if (item == "1") {
                        this.rId = pConfig.cost[item].id;
                        rNe = GameGlobal.Config.ItemConfig[pConfig.cost[item].id].name || "";
                    }
                }
            }
            UIHelper.SetLinkStyleLabel(this.lNe, lNe);
            UIHelper.SetLinkStyleLabel(this.rNe, rNe);
            // this.lbCome.text = ""
        }
        else if (this.nType === 2) {
            this.lbName.text = "完美打造";
            this.currentState = "perfit";
            this.btnBuild.icon = "ui_fb_bt_wanmeidazao";
            this.lbAddup.text = "已累计: " + GameGlobal.TreasureModel.getPerFectTime() + "次";
        }
        this.listView.dataProvider = new eui.ArrayCollection(pConfig.cost);
    };
    TreaMakeRect.prototype.onClick = function (e) {
        switch (e.target) {
            case this.btnBuild:
                this._SendUp();
                break;
            case this.lNe:
                if (this.lId) {
                    UserWarn.ins().BuyGoodsWarn(this.lId);
                }
                break;
            case this.rNe:
                if (this.rId) {
                    UserWarn.ins().BuyGoodsWarn(this.rId);
                }
                break;
        }
    };
    return TreaMakeRect;
}(BaseView));
__reflect(TreaMakeRect.prototype, "TreaMakeRect");
//# sourceMappingURL=TreaMakeRect.js.map