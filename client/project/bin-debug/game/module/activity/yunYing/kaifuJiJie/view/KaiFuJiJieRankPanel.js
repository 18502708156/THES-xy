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
var KaiFuJiJieRankPanel = (function (_super) {
    __extends(KaiFuJiJieRankPanel, _super);
    function KaiFuJiJieRankPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "KaiFuJiJieRankPanelSkin";
        return _this;
    }
    KaiFuJiJieRankPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = KaiFuJiJieRankPanelItem;
        this.list0.itemRenderer = ItemBaseNotName;
    };
    KaiFuJiJieRankPanel.prototype.OnOpen = function () {
        GameGlobal.ActivityKaiFuModel.Send_advanced_rank();
        this.AddClick(this.getwayLabel, this._OnClick);
        this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_ADVANCED_RANK, this.UpdateContent);
        this.AddTimer(1000, 0, this.updateTime);
        this.UpdateContent();
        this.updateTime();
    };
    KaiFuJiJieRankPanel.GetUpdateTime = function (jijieType) {
        if (jijieType == ActivityKaiFuJiJieType.lingtong) {
            var endTime = void 0;
            if (GameServer.serverOpenDay == 9) {
                endTime = GameServer._dayEnd3Time;
            }
            else if (GameServer.serverOpenDay == 10) {
                endTime = GameServer._dayEnd2Time;
            }
            else if (GameServer.serverOpenDay == 11) {
                endTime = GameServer.dayEndTime;
            }
            var time = DateUtils.format_1(endTime - GameServer.serverTimeMilli);
            return time;
        }
        else {
            var time = DateUtils.format_1(GameServer.dayEndTime - GameServer.serverTimeMilli);
            return time;
        }
    };
    KaiFuJiJieRankPanel.prototype.updateTime = function () {
        var time = KaiFuJiJieRankPanel.GetUpdateTime(this.jijieType);
        this.time_txt.textFlow = TextFlowMaker.generateTextFlow("\u6D3B\u52A8\u5012\u8BA1\u65F6\uFF1A|C:0x019704&T:" + time + "|");
    };
    KaiFuJiJieRankPanel.prototype.getReward = function () {
        var type = this.jijieType;
        var config = GameGlobal.Config.ProgressCrazyRandConfig;
        var arr = [];
        var obj = config[type];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var cfgObj = obj[key];
                var o = {};
                o.type = type;
                o.cfg = cfgObj;
                arr.push(o);
                if (arr.length >= 4) {
                    return arr;
                }
            }
        }
        return arr;
    };
    KaiFuJiJieRankPanel.prototype.OnClose = function () {
    };
    KaiFuJiJieRankPanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        var type = this.jijieType;
        var arrlist = this.getReward();
        var firstData = arrlist.shift();
        if (!firstData) {
            return;
        }
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
        this.list0.dataProvider = new eui.ArrayCollection(firstData.cfg.showreward);
        this.item.data = firstData.cfg.showitem;
        this.ranktips_txt.text = firstData.cfg.des;
        this.rankAward_txt.text = firstData.cfg.des2;
        var stageStr = "|C:" + Color.GetStr(Color.l_green_1) + "&T:" + GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(type) + " \u9636|";
        this.lv_txt.textFlow = TextFlowMaker.generateTextFlow("当前" + ActivityConst.JiJieTypeName(type) + "阶数：" + stageStr);
        var rankObj = GameGlobal.ActivityKaiFuModel.advancedRank[0];
        this.roleShowPanel.hideAllPanel();
        if (rankObj) {
            this.name_txt.text = GameString.GetSerAndName(rankObj.serverid, rankObj.name);
            this.powerLabel.text = rankObj.power;
            // this.roleShowPanel.visible = true;
            // this.roleShowPanel.SetAll(this.getShowById(rankObj))
            if (rankObj.outcircle) {
                this.roleShowPanel.scaleX = this.roleShowPanel.scaleY = 0.8;
                this.roleShowPanel.y = 85;
            }
            else {
                this.roleShowPanel.scaleX = this.roleShowPanel.scaleY = 1;
                this.roleShowPanel.y = 59;
            }
            RankingWin.showRolePanel(this.roleShowPanel, ActivityConst.ActivityKaiFuJiJieRankType[type], rankObj);
            this.roleShowPanel.setName("", 0xFF5900);
        }
        else {
            // this.roleShowPanel.visible = false;
            this.name_txt.text = "暂无";
            this.powerLabel.text = 0;
        }
        this.title_img.source = firstData.cfg.titleicon || "";
    };
    KaiFuJiJieRankPanel.prototype.getShowById = function (rankObj) {
        var subRole = new RoleShowData();
        subRole.job = rankObj.job;
        subRole.sex = rankObj.sex;
        subRole.rideId = RoleShowData.GetRideAppId(rankObj.outride);
        if (rankObj.skin != 0)
            subRole.clothID = RoleShowData.GetBodyAppId(rankObj.skin, rankObj.job, rankObj.sex);
        RoleShowData.GetSwordAppId(rankObj.outweapon, rankObj.job, rankObj.sex);
        return subRole;
    };
    KaiFuJiJieRankPanel.prototype.msgPrompt = function (msg) {
    };
    KaiFuJiJieRankPanel.prototype._OnClick = function (e) {
        if (e.currentTarget == this.getwayLabel) {
            GameGlobal.ActivityKaiFuModel.OpenAdvancedPanel(this.jijieType);
        }
    };
    return KaiFuJiJieRankPanel;
}(BaseView));
__reflect(KaiFuJiJieRankPanel.prototype, "KaiFuJiJieRankPanel");
var KaiFuJiJieRankPanelItem = (function (_super) {
    __extends(KaiFuJiJieRankPanelItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuJiJieRankPanelItem() {
        return _super.call(this) || this;
    }
    KaiFuJiJieRankPanelItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.getwayLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    KaiFuJiJieRankPanelItem.prototype.onClick = function (e) {
        ViewManager.ins().open(KaiFuJiJieRankWin, this.data.type);
    };
    KaiFuJiJieRankPanelItem.prototype.dataChanged = function () {
        var type = this.data.type;
        var cfgObj = this.data.cfg;
        this.list.dataProvider = new eui.ArrayCollection(cfgObj.showreward);
        this.item.data = cfgObj.showitem;
        this.tips_txt.text = cfgObj.des;
        var index = cfgObj.id - 1;
        if (cfgObj.id <= 3) {
            if (cfgObj.id == 1) {
                this.rank_txt.textColor = Color.Cyan;
            }
            else if (cfgObj.id == 2) {
                this.rank_txt.textColor = Color.Red;
            }
            else if (cfgObj.id == 3) {
                this.rank_txt.textColor = Color.Blue;
            }
            var rankObj = GameGlobal.ActivityKaiFuModel.advancedRank[index];
            if (rankObj) {
                this.name_txt.text = GameString.GetSerAndName(rankObj.serverid, rankObj.name);
                this.powerTxt.text = '战 ' + rankObj.power;
            }
            else {
                this.name_txt.text = "暂无";
                this.powerTxt.text = "";
            }
            this.rank_txt.text = "第" + StringUtils.numTenToChinese(cfgObj.id) + "名";
        }
        else {
            this.rank_txt.text = "4~20名";
            this.name_txt.text = "";
            this.powerTxt.text = "";
        }
        this.getwayLabel.visible = this.name_txt.text == "";
    };
    return KaiFuJiJieRankPanelItem;
}(eui.ItemRenderer));
__reflect(KaiFuJiJieRankPanelItem.prototype, "KaiFuJiJieRankPanelItem");
//# sourceMappingURL=KaiFuJiJieRankPanel.js.map