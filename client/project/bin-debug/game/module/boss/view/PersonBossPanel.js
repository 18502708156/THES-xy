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
var PersonBossPanel = (function (_super) {
    __extends(PersonBossPanel, _super);
    function PersonBossPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PersonBossSkin";
        _this.list.itemRenderer = PersonBossItem;
        _this.list.dataProvider = new eui.ArrayCollection([]);
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    // 引导对象
    PersonBossPanel.prototype.GetGuideTarget = function () {
        this.list.validateNow();
        return _a = {},
            _a[1] = this.list.getElementAt(0) ? this.list.getElementAt(0).goBtn : null,
            _a;
        var _a;
    };
    PersonBossPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.FB_INFO_UPDATE, this.UpdateContent);
        // GameGlobal.BossModel.sendCallPersonBossList();
        this.UpdateContent();
    };
    PersonBossPanel.prototype.OnClose = function () {
        this.removeObserve();
    };
    PersonBossPanel.prototype.UpdateContent = function () {
        var list = GameGlobal.UserFb.getPersonBoss();
        var arr = [];
        var i;
        var len = list.length;
        for (i = 0; i < len; i++) {
            arr.push(list[i]);
            if (GameGlobal.actorModel.level < list[i].levelLimit) {
                break;
            }
        }
        SortTools.sortMap(arr, 'personBossWeight', true);
        this.list.dataProvider.replaceAll(arr);
    };
    PersonBossPanel.NAME = "个人BOSS";
    return PersonBossPanel;
}(BaseView));
__reflect(PersonBossPanel.prototype, "PersonBossPanel", ["ICommonWindowTitle"]);
var PersonBossItem = (function (_super) {
    __extends(PersonBossItem, _super);
    function PersonBossItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    PersonBossItem.prototype.childrenCreated = function () {
        // this.bar.labelFunction = function(cur, max) {
        // 	return Math.floor(cur * 100 / max) + "%"
        // }
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.list.itemRenderer = ItemBaseNotName;
    };
    PersonBossItem.prototype._OnClick = function () {
        if (!UserFb.FinishAndCheckFighting()) {
            return;
        }
        GameGlobal.UserFb.sendfbJoin(1, this.data.fbID);
    };
    PersonBossItem.prototype.dataChanged = function () {
        var data = this.data;
        var config = GameGlobal.Config.DailyFubenConfig[data.fbID];
        if (config.bossid) {
            var monsterCfg = GameGlobal.Config.MonstersConfig[config.bossid];
            this.bossName.text = monsterCfg[GameGlobal.Config.MonstersConfig_keys.name] + "(" + monsterCfg[GameGlobal.Config.MonstersConfig_keys.level] + "级)";
            this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(config.bossid)));
        }
        var mycount = config.freeCount + data.vipBuyCount - data.useCount;
        if (GameGlobal.actorModel.level >= data.levelLimit) {
            this.goBtn.visible = true;
            this.enterInfoLabel.visible = false;
            var isDie = false;
            if (data.useCount > 0)
                isDie = true;
            this.dieImg.visible = isDie;
            this.goBtn.visible = !isDie;
            this.goBtn.label = data.totalCount < config.needsuccess ? "挑 战" : "免费扫荡";
        }
        else {
            this.goBtn.visible = false;
            this.enterInfoLabel.visible = true;
            this.enterInfoLabel.text = "主角" + config.levelLimit + "级可进入";
            this.dieImg.visible = false;
        }
        this.times_txt.text = "剩余挑战：" + mycount;
        this.list.dataProvider = new eui.ArrayCollection(config.showItem);
        UIHelper.ShowRedPoint(this.goBtn, mycount > 0);
    };
    return PersonBossItem;
}(eui.ItemRenderer));
__reflect(PersonBossItem.prototype, "PersonBossItem");
//# sourceMappingURL=PersonBossPanel.js.map