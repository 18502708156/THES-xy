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
var GangDefendPanel = (function (_super) {
    __extends(GangDefendPanel, _super);
    function GangDefendPanel() {
        var _this = _super.call(this) || this;
        _this.defendInfo = new GangProtectorInfo();
        _this.maxLv = 0;
        _this.nextLv = 1;
        return _this;
        //this.skinName = "GangDefendPanelSkin"
    }
    GangDefendPanel.prototype.childrenCreated = function () {
        this.renWuList.itemRenderer = GangDefendItem;
        this.renWuList.dataProvider = new eui.ArrayCollection([]);
        this.exp_bar.slideDuration = 0;
        this.exp_bar.labelFunction = this.expFuncLabel;
        for (var key in GameGlobal.Config.GuildActiveConfig) {
            this.maxLv++;
        }
        this.lbName.text = GameGlobal.Config.GuildConfig.activename;
    };
    GangDefendPanel.prototype.expFuncLabel = function (value, maximum) {
        return value + "/" + maximum;
    };
    GangDefendPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO, this.upDataProtectorInfo);
        this.observe(MessageDef.GANG_UPDATA_PROTECTOR_TASK_INFO, this.upDataTaskData);
        this._AddClick(this.challenge_btn, this._OnClick);
        this._AddClick(this.btnPrev, this._OnClick);
        this._AddClick(this.btnNext, this._OnClick);
        this._AddClick(this.protectAward_btn, this._OnClick);
        GameGlobal.GangModel.sendGetProtectorInfo();
        this.upDataProtectorInfo();
        this.upDataTaskData();
    };
    GangDefendPanel.prototype.OnClose = function () {
    };
    GangDefendPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.challenge_btn:
                var curNeed = GameGlobal.Config.GuildActiveConfig[this.nextLv].exp;
                if (this.defendInfo.totalActive < curNeed) {
                    UserTips.ins().showTips("活跃点不足");
                    return;
                }
                GameGlobal.GangModel.sendProtectorUpLv();
                break;
            case this.btnPrev:
                if (this.nextLv > 1)
                    this.nextLv -= 1;
                this.UpdateContent();
                break;
            case this.btnNext:
                if (this.nextLv < this.maxLv)
                    this.nextLv += 1;
                this.UpdateContent();
                break;
            case this.protectAward_btn:
                ViewManager.ins().open(GangProtectorJinJieAwardWin, this.nextLv);
                break;
        }
    };
    GangDefendPanel.prototype.upDataProtectorInfo = function (rsp) {
        this.defendInfo = GameGlobal.GangModel.protectorInfo;
        if (!this.defendInfo) {
            return;
        }
        this.nextLv = GameGlobal.GangModel.protectorInfo.protectorLv + 1;
        this.UpdateContent();
    };
    GangDefendPanel.prototype.UpdateContent = function () {
        if (!this.defendInfo) {
            return;
        }
        this.labLv.text = "" + this.defendInfo.protectorLv;
        var config = GameGlobal.Config.GuildActiveConfig[this.nextLv];
        if (config != null) {
            //this.lbName.text = config.
            var curAttr = [];
            if (this.nextLv <= 1) {
                for (var i = 0; i < config.attrpower.length; i++) {
                    curAttr[i] = { value: 0, 'type': config.attrpower[i].type };
                }
            }
            else
                curAttr = GameGlobal.Config.GuildActiveConfig[this.nextLv - 1].attrpower;
            this.curAttr_label.textFlow = TextFlowMaker.generateTextFlow(AttributeData.getAttStr(curAttr, 0, 1, "："));
            var nextConfig = GameGlobal.Config.GuildActiveConfig[this.nextLv];
            if (nextConfig != null) {
                this.curAttr_label.x = 13;
                this.nextImage.visible = true;
                this.nextAttrs_label.textFlow = TextFlowMaker.generateTextFlow(AttributeData.getAttStr(nextConfig.attrpower, 0, 1, "："));
                this.exp_bar.maximum = nextConfig.exp;
            }
            else {
                this.curAttr_label.x = 113;
                this.nextImage.visible = false;
                this.nextAttrs_label.text = "";
                this.exp_bar.value = config.exp;
            }
            this.exp_bar.value = this.defendInfo.totalActive;
        }
        // this.petShowPanel.SetBody(GangConst.GetFuBenBossSkin(config.bossid))
        this.defendImg.source = GameGlobal.Config.GuildActiveConfig[this.nextLv].pid;
    };
    GangDefendPanel.prototype.upDataTaskData = function () {
        var tail = [];
        var head = [];
        var config = GameGlobal.Config.GuildTaskConfig;
        var taskInfos = GameGlobal.GangModel.gangProtectorTaskInfo;
        for (var key in config) {
            var count = 0;
            for (var i = 0; i < taskInfos.length; i++) {
                if (taskInfos[i].taskId == parseInt(key)) {
                    count = taskInfos[i].count;
                }
            }
            var item = { "taskid": config[key].taskid, "maxCount": config[key].num, "curCount": count, "exp": config[key].exp, "name": config[key].name };
            if (item.maxCount <= item.curCount)
                tail.push(item);
            else
                head.push(item);
        }
        this.renWuList.dataProvider.replaceAll(head.concat(tail));
    };
    GangDefendPanel.prototype.UpdateRedPoint = function () {
    };
    GangDefendPanel.NAME = "帮会守护";
    /////////////////////////////////////////////////////////////////////////////
    GangDefendPanel.goto_types = [
        { "type": 0, "desc": "帮会妖怪" },
        { "type": 1, "desc": "采集" },
        { "type": 2, "desc": "收购橙色" },
        { "type": 3, "desc": "收购紫色" },
        { "type": 4, "desc": "收购蓝色" },
        { "type": 5, "desc": "收购绿色" },
        { "type": 6, "desc": "帮会蟠桃" },
        { "type": 7, "desc": "帮会副本" },
        { "type": 8, "desc": "帮会红色" },
    ];
    return GangDefendPanel;
}(BaseView));
__reflect(GangDefendPanel.prototype, "GangDefendPanel", ["ICommonWindowTitle"]);
var GangDefendItem = (function (_super) {
    __extends(GangDefendItem, _super);
    function GangDefendItem() {
        return _super.call(this) || this;
    }
    GangDefendItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.go_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    };
    GangDefendItem.prototype.onTap = function (e) {
        if (this.data.taskid == 1007) {
            ViewManager.ins().close(GangProtectorMainWin);
            ViewManager.ins().close(GangMainWin);
            ViewManager.ins().openIndex(GangMainWin, GangMainWin.GANG_PANTAOHUI_PANEL);
        }
        else if (this.data.taskid == 1008) {
            ViewManager.ins().close(GangProtectorMainWin);
            ViewManager.ins().close(GangMainWin);
            ViewManager.ins().openIndex(GangMainWin, GangMainWin.GANG_FUBEN_PANEL);
        }
        else {
            if (!UserFb.CheckFighting())
                return;
            GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.GuildConfig.mapid);
            ViewManager.ins().close(GangProtectorMainWin);
            ViewManager.ins().close(GangMainWin);
        }
    };
    GangDefendItem.prototype.dataChanged = function () {
        this.itemName.text = this.data.name;
        this.time_txt.text = this.data.curCount + "/" + this.data.maxCount;
        this.exp_txt.text = this.data.exp;
        if (this.itemIndex % 2 != 0) {
            this.bg.visible = false;
        }
        else {
            this.bg.visible = true;
        }
        this.itemName.text = this.data.name;
    };
    GangDefendItem.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        if (this.go_btn)
            this.go_btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTap, this);
    };
    return GangDefendItem;
}(eui.ItemRenderer));
__reflect(GangDefendItem.prototype, "GangDefendItem");
//# sourceMappingURL=GangDefendPanel.js.map