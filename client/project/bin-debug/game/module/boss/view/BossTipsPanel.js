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
var BossTipsPanel = (function (_super) {
    __extends(BossTipsPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function BossTipsPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "BossTipsSkin";
        _this.list.itemRenderer = BossTipsItem;
        return _this;
    }
    BossTipsPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "BOSS提醒";
    };
    BossTipsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var arr = [];
        var config = GameGlobal.Config.PublicBossConfig;
        for (var key in config) {
            arr.push(parseInt(key));
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    };
    BossTipsPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    BossTipsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return BossTipsPanel;
}(BaseEuiView));
__reflect(BossTipsPanel.prototype, "BossTipsPanel");
var BossTipsItem = (function (_super) {
    __extends(BossTipsItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function BossTipsItem() {
        return _super.call(this) || this;
    }
    BossTipsItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.showCheck.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    BossTipsItem.prototype.onClick = function (e) {
        GameGlobal.BossModel.setRemind(1 << (this.itemIndex + 1));
    };
    BossTipsItem.prototype.dataChanged = function () {
        this.bg.source = this.itemIndex % 2 == 0 ? "ui_bm_xilianbg01" : "ui_bm_xilianbg02";
        var config = GameGlobal.Config.PublicBossConfig[this.data];
        this.name_txt.text = GameGlobal.Config.MonstersConfig[config.bossid][GameGlobal.Config.MonstersConfig_keys.name];
        this.lv_txt.text = GameGlobal.Config.MonstersConfig[config.bossid][GameGlobal.Config.MonstersConfig_keys.level] + "级";
        if (GameGlobal.actorModel.level >= config.level) {
            this.open_txt.visible = false;
        }
        else {
            this.open_txt.visible = true;
            this.open_txt.text = config.level + "级可进入";
        }
        this.showCheck.visible = GameGlobal.actorModel.level >= config.level;
        this.showCheck.selected = GameGlobal.BossModel.getRemindByIndex(this.itemIndex);
    };
    return BossTipsItem;
}(eui.ItemRenderer));
__reflect(BossTipsItem.prototype, "BossTipsItem");
//# sourceMappingURL=BossTipsPanel.js.map