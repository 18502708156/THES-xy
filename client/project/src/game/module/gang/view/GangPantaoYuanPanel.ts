class GangPantaoYuanPanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "蟠桃会"
    /////////////////////////////////////////////////////////////////////////////
    // GangPangTaoHuiSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bnt0: eui.Button;
    protected bnt1: eui.Button;
    protected bnt2: eui.Button;
    protected PriceIcon0: PriceIcon;
    protected PriceIcon1: PriceIcon;
    protected PriceIcon2: PriceIcon;
    protected attr0: eui.Label;
    protected attr1: eui.Label;
    protected attr2: eui.Label;
    protected list: eui.List;
    protected baoXian0: eui.Image;
    protected baoXian1: eui.Image;
    protected baoXian2: eui.Image;
    protected qd0: eui.Image;
    protected qd1: eui.Image;
    protected qd2: eui.Image;
    protected exp: eui.Label;
    protected pro: eui.ProgressBar;
    protected redPoint0: eui.Image
    protected redPoint1: eui.Image
    protected redPoint2: eui.Image
    /////////////////////////////////////////////////////////////////////////////

    public constructor() {
        super()

    }

    public childrenCreated() {
        this.list.itemRenderer = GangPanTaoHuiListItem
    }

    public UpdateContent() {
        UIHelper.ShowRedPoint(this.bnt0, GameGlobal.GangModel.HasPantao())
        UIHelper.ShowRedPoint(this.bnt1, GameGlobal.GangModel.HasPantao())
        UIHelper.ShowRedPoint(this.bnt2, GameGlobal.GangModel.HasPantao())

        for (let i = 0; i < 3; i++) {
            this["redPoint"+i].visible = GameGlobal.GangModel.getPanTaoRed(i+1) == 2
            this["baoXian"+i].filters = GameGlobal.GangModel.getPanTaoRed(i+1) == 1 ? Color.GetFilter() : null;
        }



        for (let i = 0; i < 3; i++) {
            let config = GlobalConfig.ins().GuildPeachConfig[i + 1]
            this["PriceIcon" + i].setType(config.cost.id)
            this["PriceIcon" + i].setPrice(config.cost.count)
            this["qd" + i].visible = !BitUtil.Has(GameGlobal.GangModel.rewardMark, i);
            this["attr" + i].text = "+" + config.exp + "帮会资金 \n+" + config.reward.count + "" + MoneyConstToName[config.reward.id] + " \n+" + config.peachvalue + "蟠桃值"
        }
        this.exp.text = "今日进度： " + GameGlobal.GangModel.panTaoHuiExp + "/60";
        this.pro.maximum = 60
        this.pro.value = GameGlobal.GangModel.panTaoHuiExp;
        for (let i = 0; i < 3; i++) {
            GameGlobal.GangModel.getPantao ? this['bnt' + i].currentState = "disabled" : this['bnt' + i].currentState = "up"
        }
        this.updateList();
    }

    updateList() {
        this.list.dataProvider = new eui.ArrayCollection(GameGlobal.GangModel.panTaoHuiList.reverse());
    }

    public OnOpen() {
        GameGlobal.GangModel.SendGetPanTaoHuiInfo()
        for (let i = 0; i < 3; i++) {
            this.AddClick(this["bnt" + i], this._OnClick)
            this.AddClick(this["baoXian" + i], this._OnClick)
        }
        // this.pro.maximum = 300; 
        this.observe(MessageDef.GANG_UPDATE_PANTAOINFO, this.UpdateContent)
    }

    public OnClose() {

    }

    private _OnClick(e: egret.TouchEvent) {
        let src = "蟠桃会奖励";
        let config = GlobalConfig.ins().GuildPeachRewardConfig
        switch (e.currentTarget) {
            case this.bnt0:
                GameGlobal.GangModel.panTaoeatPeach(MoneyConst.gold);
                break;
            case this.bnt1:
                GameGlobal.GangModel.panTaoeatPeach(MoneyConst.yuanbao);
                break;
            case this.bnt2:
                GameGlobal.GangModel.panTaoeatPeach(MoneyConst.byb);
                break;
            case this.baoXian0:
                ViewManager.ins().open(CommonRewardsPanel, src, config[1].reward, () => {
                    GameGlobal.GangModel.panTaoBoxPeach(1)
                })
                break;
            case this.baoXian1:
                ViewManager.ins().open(CommonRewardsPanel, src, config[1].reward, () => {
                    GameGlobal.GangModel.panTaoBoxPeach(2)
                })
                break;
            case this.baoXian2:
                ViewManager.ins().open(CommonRewardsPanel, src, config[1].reward, () => {
                    GameGlobal.GangModel.panTaoBoxPeach(3)
                })
                break;
        }
    }
}