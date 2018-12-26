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
var GangMinePanel = (function (_super) {
    __extends(GangMinePanel, _super);
    function GangMinePanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.model = GameGlobal.GangMineModel;
        _this.curpage = 1;
        return _this;
    }
    GangMinePanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "GangMinePanelSkin";
        this.commonWindowBg.SetTitle('矿山争夺');
    };
    ;
    GangMinePanel.prototype.initData = function () {
        for (var i = 0; i < 10; i++) {
            var kuang = this['kuang' + i];
            switch (i) {
                case 0:
                    kuang.setType(1);
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                    kuang.setType(2);
                    break;
                case 5:
                case 6:
                case 7:
                case 8:
                    kuang.setType(3);
                    break;
                case 9:
                    kuang.setType(0);
                    break;
            }
        }
        this.resetItem();
        this.pageBtn.setPage(1);
        this.pageBtn.setMax(1);
    };
    GangMinePanel.prototype.resetItem = function () {
        this.roleGroup.touchEnabled = this.roleGroup.touchChildren = false;
        var i = 0, len = GangMineModel.MINE_MAX_NUM;
        for (i = 0; i < len; i++) {
            this['role' + i].visible = false;
        }
    };
    /**回调当前页码 */
    GangMinePanel.prototype.pageChangeFun = function (page) {
        this.curpage = page;
        this.showPageData(this.curpage);
        /**显示个人其它信息 */
        this.showOtherData();
    };
    // destoryView() {
    // 	// 不销毁该界面
    // };
    GangMinePanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.AddClick(this.ranKBtn, this.onClickHandler);
        this.AddClick(this.teamBtn, this.onClickHandler);
        var i = 0, len = GangMineModel.MINE_MAX_NUM;
        for (i = 0; i < len; i++) {
            var kuang = this['kuang' + i];
            kuang.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
        }
        this.observe(MessageDef.GANGMINE_UPDATE_INFO, this.updateContent);
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.pageChangeFun);
        this.model.sendGangMineEnter();
    };
    GangMinePanel.prototype.onClickHandler = function (e) {
        if (egret.is(e.currentTarget, 'GangMineKuangItem')) {
            var kuang = e.currentTarget;
            this.mineId = kuang.mineId;
            if (this.model.myInfo.status == 1 && this.model.myInfo.mineId == this.mineId && kuang.type == 0) {
                GameGlobal.UserTips.showTips('您已经在采矿中...');
                return;
            }
            if (this.model.mineInfos[this.mineId].status > 1 && this.model.myInfo.mineId != this.mineId) {
                if (this.model.mineInfos[this.mineId].guildName == GameGlobal.actorModel.guildName) {
                    var len = this.model.mineInfos[this.mineId].guardList.length;
                    if (len < GangMineModel.MINE_GUARD_NUM) {
                        var myTeam = GameGlobal.GangMineTeamModel.mTeamInfo;
                        if (myTeam.HasTeam()) {
                            if (myTeam.IsMyTeam()) {
                                if (len + myTeam.members.length <= GangMineModel.MINE_GUARD_NUM) {
                                    this.model.sendGangMineProtect(this.mineId);
                                }
                                else {
                                    GameGlobal.UserTips.showTips('当前开采位置不足');
                                }
                            }
                            else {
                                GameGlobal.UserTips.showTips('你不是队长无权限操作');
                            }
                        }
                        else {
                            this.model.sendGangMineProtect(this.mineId);
                        }
                    }
                    else {
                        GameGlobal.UserTips.showTips('当前开采位置不足');
                    }
                    return;
                }
            }
            switch (kuang.state) {
                case 1:
                    WarnWin.show('该矿山有一群小妖占领着，是否赶跑妖怪开始占领采矿？', this.sureHandler, this);
                    break;
                case 2:
                    this.model.sendGangMineDeatial(this.mineId);
                    ViewManager.ins().open(GangMineTeamGuardPanel, this.mineId);
                    break;
                case 3:
                case 4:
                    GameGlobal.UserTips.showTips('该矿脉正在战斗中...');
                    break;
                case 5:
                    if (this.model.myInfo.mineId == this.mineId) {
                        this.model.sendGangMineDeatial(this.mineId);
                        ViewManager.ins().open(GangMineTeamGuardPanel, this.mineId);
                    }
                    else
                        GameGlobal.UserTips.showTips('该矿脉遭受到别帮攻击，暂时不能加入守护');
                    break;
            }
            return;
        }
        if (e.target == this.ranKBtn) {
            ViewManager.ins().open(GangMineRankPanel);
        }
        else if (e.target == this.teamBtn) {
            if (GameGlobal.GangMineTeamModel.mTeamInfo.HasTeam()) {
                ViewManager.ins().open(GangMineMyTeamPanel);
            }
            else
                ViewManager.ins().open(GangMineTeamPanel);
        }
    };
    GangMinePanel.prototype.sureHandler = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.model.sendGangMineForce(this.mineId);
    };
    GangMinePanel.prototype.updateContent = function () {
        /**设置起始页 */
        this.pageBtn.setPage(this.curpage);
        /**设置最大页 */
        this.pageBtn.setMax(this.model.mineTotalNum / GangMineModel.MINE_MAX_NUM >> 0);
        this.showPageData(this.curpage);
        /**显示个人其它信息 */
        this.showOtherData();
    };
    GangMinePanel.prototype.showOtherData = function () {
        this.titleTxt.text = this.curpage + '号矿山';
        var cd = this.model.myInfo.attackTime - GameServer.serverTime;
        this.tcd.text = cd > 0 ? cd + '秒' : '无';
        if (cd > 0)
            TimerManager.ins().doTimer(1000, 0, this.updateTimes, this);
        this.teamBtn.visible = this.model.myInfo.status == 2;
        this.tliansou.text = this.model.myInfo.chainrate + '%';
        this.tscore.text = this.model.myInfo.score + '';
        this.trank.text = this.model.myInfo.rank + '';
    };
    GangMinePanel.prototype.updateTimes = function () {
        var cd = this.model.myInfo.attackTime - GameServer.serverTime;
        if (cd <= 0) {
            TimerManager.ins().remove(this.updateTimes, this);
        }
        this.tcd.text = cd > 0 ? this.cdTime + '秒' : '无';
    };
    GangMinePanel.prototype.showPageData = function (page) {
        this.resetItem();
        var i = 0, len = GangMineModel.MINE_MAX_NUM;
        for (i; i < len; i++) {
            var info = this.model.mineInfos[i + 1 + (page - 1) * len];
            this['kuang' + i].state = info.status;
            this['kuang' + i].mineId = info.mineId;
            // if (info.status >= 2 && info.status != 3) {
            //     let item: GangMineRoleItem = this['role' + i];
            //     item.visible = true;
            //     item.updateContent(info);
            // }
            var item = this['role' + i];
            //铁矿特殊处理，玩家占领不了的
            if (page * 10 == info.mineId) {
                if (info.mineId == this.model.myInfo.mineId) {
                    item.visible = true;
                    item.updateTieKuang(info.mineId);
                }
            }
            else {
                item.visible = true;
                item.updateContent(info);
            }
        }
    };
    GangMinePanel.prototype.OnClose = function () {
        this.removeEvents();
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
    ;
    GangMinePanel.LAYER_LEVEL = LayerManager.UI_Main;
    return GangMinePanel;
}(BaseEuiView));
__reflect(GangMinePanel.prototype, "GangMinePanel");
var GangMineKuangItem = (function (_super) {
    __extends(GangMineKuangItem, _super);
    function GangMineKuangItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**矿类型 0 铁矿, 1 金，2 银，3 铜*/
        _this.type = 0;
        /**矿脉ID*/
        _this.mineId = 0;
        /**占领状态 1 小怪， 2 玩家占领， 3=怪物守护战斗中， 4=玩家守护战斗中， 5=玩家守护战斗过(不可加入)*/
        _this.state = 1;
        return _this;
    }
    GangMineKuangItem.prototype.setType = function (type) {
        this.type = type;
        this.updateContent();
    };
    GangMineKuangItem.prototype.updateContent = function () {
        this.kuangImg.source = GangMineKuangItem.KUANG_TYPE[this.type];
    };
    /////////////////////////////////////////////////////////////////////////////
    /**0 铁矿, 1 金，2 银，3 铜 */
    GangMineKuangItem.KUANG_TYPE = ['tiekuang', 'ui_hddt_bt_jinkuang', 'ui_hddt_bt_yinkuang', 'ui_hddt_bt_tongkuang'];
    return GangMineKuangItem;
}(eui.Component));
__reflect(GangMineKuangItem.prototype, "GangMineKuangItem");
var GangMineRoleItem = (function (_super) {
    __extends(GangMineRoleItem, _super);
    function GangMineRoleItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isTimering = false;
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GangMineRoleItem.prototype.updateContent = function (info) {
        if (info.mineId == GameGlobal.GangMineModel.myInfo.mineId) {
            this.updateTieKuang(info.mineId);
            return;
        }
        var index = info.mineId < 6 ? 1 : 2;
        this.currentState = 'state' + index;
        this.group.visible = info.status >= 2 && info.status != 3;
        if (this.group.visible) {
            this.roleImg.source = ResDataPath.GetHeadImgName(info.guardList[0].job, info.guardList[0].sex);
            this.tname.text = info.guardList[0].name;
            this.tnum.text = info.guardList.length + '/' + GangMineModel.MINE_GUARD_NUM;
            this.tguild.text = info.guildName;
        }
        this.fightingGroup.visible = info.status > 2;
    };
    /**铁矿特殊处理 */
    GangMineRoleItem.prototype.updateTieKuang = function (mineId) {
        this.currentState = 'state3';
        this.roleImg.source = ResDataPath.GetHeadImgName(GameGlobal.actorModel.job, GameGlobal.actorModel.sex);
        if (!this.isTimering) {
            TimerManager.ins().doTimer(1000, 0, this.updateProgress, this);
            this.isTimering = true;
            this.updateProgress();
        }
    };
    GangMineRoleItem.prototype.updateProgress = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var cd = GameGlobal.GangMineModel.myInfo.gatherTime - GameServer.serverTime;
        var needtime = GameGlobal.Config.GuildDiggingBaseConfig.needtime;
        this.bar.value = needtime - cd;
        this.bar.maximum = needtime;
        this.timeTxt.text = (needtime - cd) + '秒';
        if (cd <= 0) {
            TimerManager.ins().remove(this.updateProgress, this);
            this.isTimering = false;
            GameGlobal.GangMineModel.sendGangMineCollect();
        }
    };
    return GangMineRoleItem;
}(eui.Component));
__reflect(GangMineRoleItem.prototype, "GangMineRoleItem");
//# sourceMappingURL=GangMinePanel.js.map