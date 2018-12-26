class GangMinePanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Main;

    /////////////////////////////////////////////////////////////////////////////
    // GangMinePanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonWindowBg: CommonWindowBg;
    protected titleTxt: eui.Label;
    protected tscore: eui.Label;
    protected trank: eui.Label;
    protected teamBtn: eui.Button;
    protected ranKBtn: eui.Button;
    protected tliansou: eui.Label;
    protected tcd: eui.Label;
    protected kuangGroup: eui.Group;
    protected roleGroup: eui.Group;
    protected pageBtn: PageButton;
    /////////////////////////////////////////////////////////////////////////////

    private model = GameGlobal.GangMineModel;
    private curpage: number = 1;
    /**选中的矿脉ID */
    private mineId: number;
    /**挑战CD */
    private cdTime: number;

    public constructor() {
        super()
    }

    initUI() {
        super.initUI();
        this.skinName = "GangMinePanelSkin";
        this.commonWindowBg.SetTitle('矿山争夺');
    };

    initData() {
        for (let i = 0; i < 10; i++) {
            let kuang: GangMineKuangItem = this['kuang' + i];
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
    }
    private resetItem() {
        this.roleGroup.touchEnabled = this.roleGroup.touchChildren = false;
        let i = 0, len = GangMineModel.MINE_MAX_NUM;
        for (i = 0; i < len; i++) {
            this['role' + i].visible = false;
        }
    }

    /**回调当前页码 */
    private pageChangeFun(page) {
        this.curpage = page;
        this.showPageData(this.curpage);
        /**显示个人其它信息 */
        this.showOtherData();
    }

    // destoryView() {
    // 	// 不销毁该界面
    // };

    OnOpen(...args: any[]) {
        this.commonWindowBg.OnAdded(this);
        this.AddClick(this.ranKBtn, this.onClickHandler);
        this.AddClick(this.teamBtn, this.onClickHandler);
        let i = 0, len = GangMineModel.MINE_MAX_NUM;
        for (i = 0; i < len; i++) {
            let kuang: GangMineKuangItem = this['kuang' + i];
            kuang.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
        }
        this.observe(MessageDef.GANGMINE_UPDATE_INFO, this.updateContent);
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.pageChangeFun);
        this.model.sendGangMineEnter();
    }

    private onClickHandler(e: egret.TouchEvent) {
        if (egret.is(e.currentTarget, 'GangMineKuangItem')) {
            let kuang: GangMineKuangItem = e.currentTarget as GangMineKuangItem;
            this.mineId = kuang.mineId;
            if (this.model.myInfo.status == 1 && this.model.myInfo.mineId == this.mineId && kuang.type == 0) {
                GameGlobal.UserTips.showTips('您已经在采矿中...')
                return;
            }
            if (this.model.mineInfos[this.mineId].status > 1 && this.model.myInfo.mineId != this.mineId) {
                if (this.model.mineInfos[this.mineId].guildName == GameGlobal.actorModel.guildName) {
                    let len = this.model.mineInfos[this.mineId].guardList.length;
                    if (len < GangMineModel.MINE_GUARD_NUM) {
                        let myTeam = GameGlobal.GangMineTeamModel.mTeamInfo;
                        if (myTeam.HasTeam()) {
                            if (myTeam.IsMyTeam()) {
                                if (len + myTeam.members.length <= GangMineModel.MINE_GUARD_NUM) {
                                    this.model.sendGangMineProtect(this.mineId);
                                } else {
                                    GameGlobal.UserTips.showTips('当前开采位置不足')
                                }
                            } else {
                                GameGlobal.UserTips.showTips('你不是队长无权限操作')
                            }
                        } else {
                            this.model.sendGangMineProtect(this.mineId);
                        }
                    } else {
                        GameGlobal.UserTips.showTips('当前开采位置不足')
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
                    ViewManager.ins().open(GangMineTeamGuardPanel, this.mineId)
                    break;
                case 3:
                case 4:
                    GameGlobal.UserTips.showTips('该矿脉正在战斗中...')
                    break;
                case 5:
                    if (this.model.myInfo.mineId == this.mineId) {//表示我自己守护的
                        this.model.sendGangMineDeatial(this.mineId);
                        ViewManager.ins().open(GangMineTeamGuardPanel, this.mineId)
                    }
                    else GameGlobal.UserTips.showTips('该矿脉遭受到别帮攻击，暂时不能加入守护')
                    break;
            }
            return;
        }
        if (e.target == this.ranKBtn) {
            ViewManager.ins().open(GangMineRankPanel);
        }
        else if (e.target == this.teamBtn) {
            if (GameGlobal.GangMineTeamModel.mTeamInfo.HasTeam()) {//已有队伍
                ViewManager.ins().open(GangMineMyTeamPanel);
            }
            else ViewManager.ins().open(GangMineTeamPanel);
        }
    }

    private sureHandler(...param) {
        this.model.sendGangMineForce(this.mineId);
    }

    private updateContent() {
        /**设置起始页 */
        this.pageBtn.setPage(this.curpage);
        /**设置最大页 */
        this.pageBtn.setMax(this.model.mineTotalNum / GangMineModel.MINE_MAX_NUM >> 0);
        this.showPageData(this.curpage);
        /**显示个人其它信息 */
        this.showOtherData();
    }

    private showOtherData() {
        this.titleTxt.text = this.curpage + '号矿山';
        let cd = this.model.myInfo.attackTime - GameServer.serverTime;
        this.tcd.text = cd > 0 ? cd + '秒' : '无';
        if (cd > 0) TimerManager.ins().doTimer(1000, 0, this.updateTimes, this);

        this.teamBtn.visible = this.model.myInfo.status == 2;
        this.tliansou.text = this.model.myInfo.chainrate + '%';
        this.tscore.text = this.model.myInfo.score + '';
        this.trank.text = this.model.myInfo.rank + '';
    }
    private updateTimes(): void {
        let cd = this.model.myInfo.attackTime - GameServer.serverTime;
        if (cd <= 0) {
            TimerManager.ins().remove(this.updateTimes, this);
        }
        this.tcd.text = cd > 0 ? this.cdTime + '秒' : '无';
    }

    private showPageData(page) {
        this.resetItem();
        let i = 0, len = GangMineModel.MINE_MAX_NUM;
        for (i; i < len; i++) {
            let info = this.model.mineInfos[i + 1 + (page - 1) * len];
            this['kuang' + i].state = info.status;
            this['kuang' + i].mineId = info.mineId;
            // if (info.status >= 2 && info.status != 3) {
            //     let item: GangMineRoleItem = this['role' + i];
            //     item.visible = true;
            //     item.updateContent(info);
            // }
            let item: GangMineRoleItem = this['role' + i];
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
    }

    OnClose() {
        this.removeEvents();
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
}

class GangMineKuangItem extends eui.Component {
    /////////////////////////////////////////////////////////////////////////////
    // GangMineKuangItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected kuangImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////
    /**0 铁矿, 1 金，2 银，3 铜 */
    private static KUANG_TYPE = ['tiekuang', 'ui_hddt_bt_jinkuang', 'ui_hddt_bt_yinkuang', 'ui_hddt_bt_tongkuang'];
    /**矿类型 0 铁矿, 1 金，2 银，3 铜*/
    public type: number = 0;
    /**矿脉ID*/
    public mineId: number = 0;
    /**占领状态 1 小怪， 2 玩家占领， 3=怪物守护战斗中， 4=玩家守护战斗中， 5=玩家守护战斗过(不可加入)*/
    public state: number = 1;

    public setType(type) {
        this.type = type;
        this.updateContent();
    }
    private updateContent() {
        this.kuangImg.source = GangMineKuangItem.KUANG_TYPE[this.type];
    }
}

class GangMineRoleItem extends eui.Component {

    /////////////////////////////////////////////////////////////////////////////
    // GangMineRoleItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected group: eui.Group;
    protected imgGroup: eui.Group;
    protected roleImg: eui.Image;
    protected fightingGroup: eui.Group;
    protected tname: eui.Label;
    protected tguild: eui.Label;
    protected tnum: eui.Label;
    protected bar: eui.ProgressBar;
    protected timeTxt: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

    public updateContent(info: GangMineInfo) {
        if (info.mineId == GameGlobal.GangMineModel.myInfo.mineId) {
            this.updateTieKuang(info.mineId);
            return;
        }
        let index = info.mineId < 6 ? 1 : 2;
        this.currentState = 'state' + index;
        this.group.visible = info.status >= 2 && info.status != 3;
        if (this.group.visible) {
            this.roleImg.source = ResDataPath.GetHeadImgName(info.guardList[0].job, info.guardList[0].sex);
            this.tname.text = info.guardList[0].name;
            this.tnum.text = info.guardList.length + '/' + GangMineModel.MINE_GUARD_NUM;
            this.tguild.text = info.guildName;
        }
        this.fightingGroup.visible = info.status > 2;
    }

    private isTimering: boolean = false;
    /**铁矿特殊处理 */
    public updateTieKuang(mineId) {
        this.currentState = 'state3';
        this.roleImg.source = ResDataPath.GetHeadImgName(GameGlobal.actorModel.job, GameGlobal.actorModel.sex);
        if (!this.isTimering) {
            TimerManager.ins().doTimer(1000, 0, this.updateProgress, this);
            this.isTimering = true;
            this.updateProgress();
        }
    }
    private updateProgress(...param) {
        let cd = GameGlobal.GangMineModel.myInfo.gatherTime - GameServer.serverTime;
        let needtime = GameGlobal.Config.GuildDiggingBaseConfig.needtime;
        this.bar.value = needtime - cd;
        this.bar.maximum = needtime;
        this.timeTxt.text = (needtime - cd) + '秒';
        if (cd <= 0) {
            TimerManager.ins().remove(this.updateProgress, this);
            this.isTimering = false;
            GameGlobal.GangMineModel.sendGangMineCollect();
        }
    }
}
