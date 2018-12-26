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
var GangJuanXianListWin = (function (_super) {
    __extends(GangJuanXianListWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangJuanXianListWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangJuanXianListSkin";
        _this.commonWindowBg.SetTitle("帮会捐献");
        return _this;
    }
    GangJuanXianListWin.prototype.childrenCreated = function () {
        this.listGang.itemRenderer = GangJanXianItem;
        this.listGang.dataProvider = new eui.ArrayCollection([]);
        this.get_txt1.text = "帮会副本";
        this.get_txt2.text = "帮会地图";
    };
    GangJuanXianListWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.AddClick(this.get_txt1, this.openGetWin);
        this.AddClick(this.get_txt2, this.openGetWin);
        this.observe(MessageDef.BAG_ITEM_COUNT_CHANGE, this.UpdateContent);
        this.UpdateContent();
    };
    GangJuanXianListWin.prototype.openGetWin = function (e) {
        if (e.target == this.get_txt1) {
            ViewManager.ins().close(this);
            ViewManager.ins().openIndex(GangMainWin, 1);
            return;
        }
        if (e.target == this.get_txt2) {
            if (!UserFb.CheckFighting())
                return;
            GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.GuildConfig.mapid);
            ViewManager.ins().close(this);
            ViewManager.ins().close(GangMainWin);
        }
    };
    GangJuanXianListWin.prototype.UpdateContent = function () {
        var itemLists = [];
        var config = GameGlobal.Config.GuildDonateConfig;
        for (var key in config) {
            itemLists.push(config[key]);
        }
        this.listGang.dataProvider.replaceAll(itemLists);
    };
    GangJuanXianListWin.prototype.OnClose = function () {
    };
    GangJuanXianListWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GangJuanXianListWin;
}(BaseEuiView));
__reflect(GangJuanXianListWin.prototype, "GangJuanXianListWin", ["ICommonWindow"]);
var GangJanXianItem = (function (_super) {
    __extends(GangJanXianItem, _super);
    function GangJanXianItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    //private needName = "";
    GangJanXianItem.prototype.childrenCreated = function () {
        this.btnApply.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    GangJanXianItem.prototype.dataChanged = function () {
        var cost = this.data.cost;
        var itemConfig = GameGlobal.Config.ItemConfig[cost.id];
        this.itemName.text = itemConfig.name;
        this.imgIcon.isShowName(false);
        this.imgIcon.setDataByConfig(itemConfig);
        this.imgIcon.setCount("");
        this.desc_txt.text = itemConfig.desc;
        var hadCount = GameGlobal.UserBag.GetCount(cost.id);
        this.had_txt.text = "（拥有：" + hadCount + "）";
    };
    GangJanXianItem.prototype._OnBtnClick = function (e) {
        if (GameGlobal.GangModel.mCoutributeCount >= GameGlobal.Config.GuildConfig.maxcount) {
            UserTips.ins().showTips("\u6350\u732E\u6B21\u6570\u5DF2\u8FBE\u4E0A\u9650,\u6BCF\u5929\u53EF\u6350\u732E" + GameGlobal.Config.GuildConfig.maxcount + "\u6B21");
            return;
        }
        var id = this.data.id;
        if (Checker.Data(this.data.cost))
            GameGlobal.GangModel.SendGetJuanXuanList(id);
    };
    GangJanXianItem.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        if (this.btnApply)
            this.btnApply.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    return GangJanXianItem;
}(eui.ItemRenderer));
__reflect(GangJanXianItem.prototype, "GangJanXianItem");
//# sourceMappingURL=GangJuanXianListWin.js.map