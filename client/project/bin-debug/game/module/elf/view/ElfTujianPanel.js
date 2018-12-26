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
var ElfTujianPanel = (function (_super) {
    __extends(ElfTujianPanel, _super);
    function ElfTujianPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._gTitle = [{ name: "普通召唤" }, { name: "元宝召唤" }];
        _this._gElf = [];
        _this._gListItemData = [];
        _this._nTabSeleckIndex = 0;
        _this.skinName = "ElfTuJianSkin";
        var config = GameGlobal.Config.CallListConfig;
        for (var key in config) {
            _this._gElf.push(config[key]);
        }
        return _this;
    }
    ElfTujianPanel.prototype.createChildren = function () {
        this.List.itemRenderer = ElfTuJianItem;
        this.tabList.itemRenderer = WindowTabBarItem;
    };
    ElfTujianPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDlg.OnAdded(this);
        this.commonDlg.SetTitle("召灵预览");
        this._AddItemClick(this.tabList, this._onItmeClick);
        this._nTabSeleckIndex = param[0] || 0;
        this.tabList.dataProvider = new eui.ArrayCollection(this._gTitle);
        this.tabList.selectedIndex = this._nTabSeleckIndex;
        this.updateCnetent();
    };
    ElfTujianPanel.prototype.updateCnetent = function () {
        this.List.dataProvider = new eui.ArrayCollection(this._gElf[this._nTabSeleckIndex]);
    };
    ElfTujianPanel.prototype._onItmeClick = function () {
        this._nTabSeleckIndex = this.tabList.selectedIndex;
        this.updateCnetent();
    };
    ElfTujianPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return ElfTujianPanel;
}(BaseEuiView));
__reflect(ElfTujianPanel.prototype, "ElfTujianPanel");
var ElfTuJianItem = (function (_super) {
    __extends(ElfTuJianItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ElfTuJianItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "ElfTuJianItemSkin";
        return _this;
    }
    ElfTuJianItem.prototype.createChildren = function () {
        this.List.itemRenderer = ElfTujianHeadItem;
        this.List.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTap, this);
    };
    ElfTuJianItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        this.tipsTxt.text = this.data.title;
        this.List.dataProvider = new eui.ArrayCollection(this.data.list);
    };
    ElfTuJianItem.prototype._onTap = function () {
    };
    return ElfTuJianItem;
}(eui.ItemRenderer));
__reflect(ElfTuJianItem.prototype, "ElfTuJianItem");
var ElfTujianHeadItem = (function (_super) {
    __extends(ElfTujianHeadItem, _super);
    function ElfTujianHeadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElfTujianHeadItem.prototype.childrenCreated = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTap, this);
    };
    ElfTujianHeadItem.prototype.dataChanged = function () {
        var config = this.data;
        var id = config.id;
        if (config.type == 2) {
            this.item.setItemImg(LingtongConst.GetHeadIcon(id));
            this.item.setItemBg(ResDataPath.GetItemQualityName(LingtongInfo.GetQuality(id)));
            if (config.effid && !this._Mc) {
                this._Mc = new MovieClip;
                this._Mc.loadUrl(ResDataPath.GetUIEffePath2(config.effid), true, -1);
                this._Mc.blendMode = egret.BlendMode.ADD;
                this._Mc.scaleX = 1.6;
                this._Mc.scaleY = 1.6;
                this._Mc.x = this.item.width >> 1;
                this._Mc.y = this.item.height >> 1;
                this.item.addChild(this._Mc);
            }
        }
        else {
            var itemConfig = GlobalConfig.ins().ItemConfig[id];
            this.item.setData(itemConfig);
        }
        this.selecteImg.visible = false;
    };
    ElfTujianHeadItem.prototype.openItemTips = function (id, count) {
        var config = GameGlobal.Config.ItemConfig[id];
        if (config.pid && config.pid > 0) {
            ViewManager.ins().open(TianshenDetailWin, config, count);
            return;
        }
        ViewManager.ins().open(ItemDetailedWin, 0, id, count);
    };
    ElfTujianHeadItem.prototype._onTap = function () {
        if (this.data.type != 2)
            this.openItemTips(this.data.id, this.data.count);
        else {
            ViewManager.ins().open(ElfDetailsPanel, this.data.id);
        }
    };
    return ElfTujianHeadItem;
}(eui.ItemRenderer));
__reflect(ElfTujianHeadItem.prototype, "ElfTujianHeadItem");
//# sourceMappingURL=ElfTujianPanel.js.map