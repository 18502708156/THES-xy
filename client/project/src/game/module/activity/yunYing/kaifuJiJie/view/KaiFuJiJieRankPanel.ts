
class KaiFuJiJieRankPanel extends BaseView {
    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieRankPanelSkin.exml
    /////////////////////////////////////////////////////////////////////////////

    protected name_txt: eui.Label;
    protected time_txt: eui.Label;
    protected list0: eui.List;
    protected lv_txt: eui.Label;
    protected getwayLabel: GetwayLabel;
    protected item: ItemBaseNotName;
    protected ranktips_txt: eui.Label;
    protected rankAward_txt: eui.Label;
    protected powerLabel: PowerLabel;
    protected roleShowPanel: PHBShowPanel;
    protected list: eui.List;
    protected title_img: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    // 进阶类型
    public jijieType: number


    public constructor() {
        super()
        this.skinName = "KaiFuJiJieRankPanelSkin";
    }
    public childrenCreated() {
        this.list.itemRenderer = KaiFuJiJieRankPanelItem;
        this.list0.itemRenderer = ItemBaseNotName;
    }
    public OnOpen() {
        GameGlobal.ActivityKaiFuModel.Send_advanced_rank();
        this.AddClick(this.getwayLabel, this._OnClick);
        this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent)
        this.observe(MessageDef.ACTIVITY_ADVANCED_RANK, this.UpdateContent)
        this.AddTimer(1000, 0, this.updateTime)
        this.UpdateContent();
        this.updateTime();

    }

    public static GetUpdateTime(jijieType: number) {
        if (jijieType == ActivityKaiFuJiJieType.lingtong) {
            let endTime
            if (GameServer.serverOpenDay == 9) {
                endTime = GameServer._dayEnd3Time
            } else if (GameServer.serverOpenDay == 10) {
                endTime = GameServer._dayEnd2Time
            } else if (GameServer.serverOpenDay == 11) {
                endTime = GameServer.dayEndTime
            } 
            var time = DateUtils.format_1(endTime - GameServer.serverTimeMilli);
            return time
        } else {
            var time = DateUtils.format_1(GameServer.dayEndTime - GameServer.serverTimeMilli);
            return time
        }
    }

    private updateTime(): void {
        let time = KaiFuJiJieRankPanel.GetUpdateTime(this.jijieType)
        this.time_txt.textFlow = TextFlowMaker.generateTextFlow(`活动倒计时：|C:0x019704&T:${time}|`);
    }
    
    private getReward(): any {
        let type = this.jijieType
        let config = GameGlobal.Config.ProgressCrazyRandConfig;
        let arr = []
        let obj = config[type];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let cfgObj = obj[key];
                let o: any = {};
                o.type = type;
                o.cfg = cfgObj

                arr.push(o);
                if (arr.length >= 4) {
                    return arr;
                }
            }
        }
        return arr
    }
    public OnClose() {

    }
    public UpdateContent() {
        if (!this.visible) return;
        let type = this.jijieType
        let arrlist = this.getReward();
        let firstData = arrlist.shift()
        if (!firstData) {
            return;
        }
        this.list.dataProvider = new eui.ArrayCollection(arrlist);
        this.list0.dataProvider = new eui.ArrayCollection(firstData.cfg.showreward);
        this.item.data = firstData.cfg.showitem;
        this.ranktips_txt.text = firstData.cfg.des
        this.rankAward_txt.text = firstData.cfg.des2
        let stageStr = `|C:${Color.GetStr(Color.l_green_1)}&T:${GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(type)} 阶|`
        this.lv_txt.textFlow = TextFlowMaker.generateTextFlow("当前" + ActivityConst.JiJieTypeName(type) + "阶数：" + stageStr)

        let rankObj = GameGlobal.ActivityKaiFuModel.advancedRank[0];
        this.roleShowPanel.hideAllPanel();
        if (rankObj) {
            this.name_txt.text = GameString.GetSerAndName(rankObj.serverid, rankObj.name);
            this.powerLabel.text = rankObj.power;
            // this.roleShowPanel.visible = true;
            // this.roleShowPanel.SetAll(this.getShowById(rankObj))
         
            if (rankObj.outcircle){
                this.roleShowPanel.scaleX = this.roleShowPanel.scaleY = 0.8;
                this.roleShowPanel.y = 85
            }else{
                this.roleShowPanel.scaleX = this.roleShowPanel.scaleY = 1;
                this.roleShowPanel.y = 59
            }
            RankingWin.showRolePanel(this.roleShowPanel, ActivityConst.ActivityKaiFuJiJieRankType[type], rankObj)
            this.roleShowPanel.setName("", 0xFF5900);
        } else {
            // this.roleShowPanel.visible = false;
            this.name_txt.text = "暂无"
            this.powerLabel.text = 0;
        }
        this.title_img.source = firstData.cfg.titleicon || ""
    }
    public getShowById(rankObj: Sproto.rank_data_list) {
        let subRole = new RoleShowData();

        subRole.job = rankObj.job;
        subRole.sex = rankObj.sex;
        subRole.rideId = RoleShowData.GetRideAppId(rankObj.outride);
        if (rankObj.skin != 0)
            subRole.clothID = RoleShowData.GetBodyAppId(rankObj.skin, rankObj.job, rankObj.sex);

        RoleShowData.GetSwordAppId(rankObj.outweapon, rankObj.job, rankObj.sex)

        return subRole;
    }

    private msgPrompt(msg) {

    }

    private _OnClick(e: egret.TouchEvent) {
        if (e.currentTarget == this.getwayLabel) {
            GameGlobal.ActivityKaiFuModel.OpenAdvancedPanel(this.jijieType);
        }
    }

}

class KaiFuJiJieRankPanelItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // KaiFuJiJieRankPanelItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected rank_txt: eui.Label;
    protected name_txt: eui.Label;
    protected powerTxt: eui.Label;
    protected getwayLabel: eui.Label;
    protected tips_txt: eui.Label;
    protected list: eui.List;
    protected item: ItemBaseNotName;
    /////////////////////////////////////////////////////////////////////////////


    public constructor() {
        super()
    }
    public childrenCreated() {
        this.list.itemRenderer = ItemBaseNotName;
        this.getwayLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }
    private onClick(e: egret.TouchEvent): void {
        ViewManager.ins().open(KaiFuJiJieRankWin, this.data.type);
    }

    dataChanged() {

        let type = this.data.type;
        let cfgObj = this.data.cfg

        this.list.dataProvider = new eui.ArrayCollection(cfgObj.showreward);
        this.item.data = cfgObj.showitem;
        this.tips_txt.text = cfgObj.des
        let index = cfgObj.id - 1;

        if (cfgObj.id <= 3) {
            if (cfgObj.id == 1) {
                this.rank_txt.textColor = Color.Cyan
            } else if (cfgObj.id == 2) {
                this.rank_txt.textColor = Color.Red
            } else if (cfgObj.id == 3) {
                this.rank_txt.textColor = Color.Blue
            }

            let rankObj = GameGlobal.ActivityKaiFuModel.advancedRank[index];
            if (rankObj) {
                this.name_txt.text = GameString.GetSerAndName(rankObj.serverid, rankObj.name);
                this.powerTxt.text = '战 ' + rankObj.power;
            } else {
                this.name_txt.text = "暂无"
                this.powerTxt.text = ""
            }
            this.rank_txt.text = "第" + StringUtils.numTenToChinese(cfgObj.id) + "名"
        } else {
            this.rank_txt.text = "4~20名"
            this.name_txt.text = "";
            this.powerTxt.text = "";
        }
        this.getwayLabel.visible = this.name_txt.text == ""

    }


}