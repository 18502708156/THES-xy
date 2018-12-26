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
var FieldBossPanel = (function (_super) {
    __extends(FieldBossPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FieldBossPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FieldBossSkin";
        _this.list.itemRenderer = FieldBossItem;
        _this.list.dataProvider = new eui.ArrayCollection([]);
        return _this;
    }
    FieldBossPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.FIELD_BOSS_UPDATE, this.UpdateContent);
        GameGlobal.BossModel.sendCallFieldBossList();
        this.UpdateContent();
    };
    FieldBossPanel.prototype.OnClose = function () {
    };
    FieldBossPanel.prototype.UpdateContent = function () {
        var list = GameGlobal.BossModel.GetBossInfos(Enum_BOSSTYPE.field_boss);
        var arr = [];
        var i;
        var len = list.length;
        for (i = 0; i < len; i++) {
            arr.push(list[i]);
            if (GameGlobal.actorModel.level < list[i].level) {
                break;
            }
        }
        SortTools.sortMap(arr, 'Weight', true);
        this.list.dataProvider.replaceAll(arr);
    };
    FieldBossPanel.NAME = "野外BOSS";
    return FieldBossPanel;
}(BaseView));
__reflect(FieldBossPanel.prototype, "FieldBossPanel", ["ICommonWindowTitle"]);
var FieldBossItem = (function (_super) {
    __extends(FieldBossItem, _super);
    function FieldBossItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    FieldBossItem.prototype.childrenCreated = function () {
        this.bar.labelFunction = function (cur, max) {
            return Math.floor(cur * 100 / max) + "%";
        };
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    FieldBossItem.prototype._OnClick = function () {
        var data = this.data;
        var config = data.GetConfig();
        ViewManager.ins().open(FieldBossDetailPanel, config.id);
    };
    FieldBossItem.prototype.dataChanged = function () {
        var data = this.data;
        var config = data.GetConfig();
        var monsterCfg = GameGlobal.Config.MonstersConfig[config.bossid];
        this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(config.bossid)));
        this.bar.maximum = monsterCfg[GameGlobal.Config.MonstersConfig_keys.hp];
        this.bar.value = data.hp;
        this.bossName.text = monsterCfg[GameGlobal.Config.MonstersConfig_keys.name] + "(" + monsterCfg[GameGlobal.Config.MonstersConfig_keys.level] + "级)";
        if (GameGlobal.actorModel.level >= config.level) {
            this.goBtn.visible = true;
            this.enterInfoLabel.visible = false;
        }
        else {
            this.goBtn.visible = false;
            this.enterInfoLabel.visible = true;
            this.enterInfoLabel.text = "主角" + config.level + "级可进入";
        }
        this.freshImg.visible = !this.enterInfoLabel.visible;
        this.nextTimeLabel.text = GameGlobal.BossModel.GetNextRefreshTime();
        if (data.isDie) {
            this.runTime.text = "Boss刷新后25分钟";
            this.runTime.textColor = 0x019704;
            this.freshImg.source = "ui_boss_bm_beijisha";
        }
        else if (data.IsClose()) {
            this.runTime.text = "已逃跑";
            this.runTime.textColor = 0xff0000;
            this.freshImg.source = "ui_boss_bm_yitaopao";
        }
        else {
            this.runTime.text = GameGlobal.BossModel.GetRunTime();
            this.runTime.textColor = 0x019704;
            this.freshImg.source = "ui_boss_bm_yishuaxin";
        }
    };
    return FieldBossItem;
}(eui.ItemRenderer));
__reflect(FieldBossItem.prototype, "FieldBossItem");
//# sourceMappingURL=FieldBossPanel.js.map