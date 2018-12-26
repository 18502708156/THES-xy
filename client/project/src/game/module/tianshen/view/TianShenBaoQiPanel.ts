class TianShenBaoQiPanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "宝器"

    /////////////////////////////////////////////////////////////////////////////
    // TianShenBaoQiSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected baoQiItem1: TianShenBaoQiHeadItem;
    protected baoQiItem2: TianShenBaoQiHeadItem;
    protected baoQiItem3: TianShenBaoQiHeadItem;
    protected baoQiItem4: TianShenBaoQiHeadItem;
    protected lbLev: eui.Label;
    protected powerLabel: PowerLabel;
    protected showImg: eui.Image;
    protected tpower: eui.Label;
    protected tcurName: eui.Label;
    protected curProLabel0: eui.Label;
    protected curProLabel1: eui.Label;
    protected curProLabel2: eui.Label;
    protected tnextName: eui.Label;
    protected nextProLabel0: eui.Label;
    protected nextProLabel1: eui.Label;
    protected nextProLabel2: eui.Label;
    protected btnGM: eui.Button;
    protected tpreview: eui.Label;
    protected tdesc: eui.Label;
    protected btnCulture: eui.Button;
    protected btnAuto: eui.Button;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected consumeLabel: ConsumeTwoLabel;
    protected checkBox: eui.CheckBox;
    /////////////////////////////////////////////////////////////////////////////
    private mModel = GameGlobal.TianShenBaoQiModel;
    private mBaoQiPlots: TianShenBaoQiHeadItem[] = [];
    private mBaoQiList;
    private pos = 1;
    private mRoleAutoSendData: RoleAutoSendData;
    private mRoleSendCheckData: RoleSendCheckData;

    public constructor() {
        super()
        this.mRoleAutoSendData = new RoleAutoSendData(() => {
            if (!this._SendUp()) {
                this.mRoleAutoSendData.Stop()
            }
        }, () => {
            if (this.mRoleAutoSendData.mIsAuto) {
                this.btnAuto.label = "停止"
            } else {
                this.btnAuto.label = "自动进阶"
            }
        }, 200)
        this.mRoleSendCheckData = new RoleSendCheckData((type) => {
            if (this.mModel) {
                this.mModel.sendUpLevel(this.pos, type)
            }
        }, () => {
            let info = this.mModel.mTianShenBaoQiDatas[this.pos];
            let levelConfig = info.GetLevelConfig();
            if (!levelConfig) {
                return [null]
            }
            let cost = levelConfig.cost
            return [cost[0].id, cost[0].count, cost[1].id, cost[1].count]
        }, () => {
            return this.checkBox.selected
        }, () => {
            this.mRoleAutoSendData.Toggle()
        })
    }

    public childrenCreated() {

        this.mBaoQiPlots.push(this.baoQiItem1)
        this.mBaoQiPlots.push(this.baoQiItem2)
        this.mBaoQiPlots.push(this.baoQiItem3)
        this.mBaoQiPlots.push(this.baoQiItem4)
        this.mBaoQiList = CommonUtils.GetArray(GameGlobal.Config.AirMarshalTreasureConfig, "id");
        for (let i = 0; i < 4; i++) {
            this.mBaoQiPlots[i].setData(this.mBaoQiList[i]);
        }

        this._AddClick(this.baoQiItem1, this._OnClick);
        this._AddClick(this.baoQiItem2, this._OnClick);
        this._AddClick(this.baoQiItem3, this._OnClick);
        this._AddClick(this.baoQiItem4, this._OnClick);

        this._AddClick(this.btnGM, this._OnClick);
        this._AddClick(this.btnCulture, this._OnClick)
        this._AddClick(this.btnAuto, this._OnClick)
    }

    /**
    * 面板开启执行函数，用于子类继承
    * @param param 参数
    */
    public OnOpen(...param: any[]) {
        this.observe(MessageDef.TIANSHEN_BAOQI_UPDATE_INFO, this.UpdateContent)
        this.observe(MessageDef.TIANSHEN_BAOQI_UPDATE_EXP, this._DoUpdateExp)
    }

    /**
	 * 面板关闭执行函数，用于子类继承
	 * @param param 参数
	 */
    public OnClose(...param: any[]) {
        this.removeObserve();
        this.mRoleAutoSendData.Stop()
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.baoQiItem1:
            case this.baoQiItem2:
            case this.baoQiItem3:
            case this.baoQiItem4:
                let item: TianShenBaoQiHeadItem = e.currentTarget as TianShenBaoQiHeadItem;
                if (item.isopen) {
                    this.setState(item.pos);
                    this.pos = item.pos;
                }
                else {
                    let config = GameGlobal.Config.AirMarshalTreasureConfig[item.pos];
                    if (config) {
                        UserTips.ins().showTips(config.des);
                    }
                }
                break;
            case this.btnCulture:
                this._SendUp()
                break
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle()
                break
            case this.btnGM:
                ViewManager.ins().open(TianShenGmPanel);
                break
        }
    }

    private setState(index: number): void {
        let i = 0, len = this.mBaoQiPlots.length;
        for (i; i < len; i++) {
            this.mBaoQiPlots[i].currentState = 'up';
        }
        this['baoQiItem' + index].currentState = 'down';
    }

    public UpdateContent() {
        let info = this.mModel.mTianShenBaoQiDatas[this.pos];
        //选中
        this.setState(this.pos);
        this.mBaoQiPlots[this.pos - 1].updateLevel(info.mLevel);
        let config = GameGlobal.TianShenBaoQiModel.getConfig();
        this.lbLev.text = info.mLevel + "\n阶";
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(config[this.pos].attrs) + GameGlobal.TianShenBaoQiModel.getPower(this.pos, info.mLevel - 1);

        this.showImg.source = config[this.pos].icon //+ '_s';

        let levelsConfig = GameGlobal.Config.AirMarshalTreasureAttrsConfig[this.pos];
        let curConfig = levelsConfig[info.mLevel - 1];
        let nextConfig = levelsConfig[info.mLevel];
        if (!nextConfig) {
            this.currentState = 'full';
            this.tcurName.text = this.mBaoQiList[this.pos - 1].name + ' ' + info.mLevel + '阶';
            this.showCurAttrs(curConfig);
            return;
        }
        else {
            this.currentState = 'normal';
        }

        //显示属性
        this.tcurName.text = this.mBaoQiList[this.pos - 1].name + ' ' + info.mLevel + '阶';
        this.tnextName.text = this.mBaoQiList[this.pos - 1].name + ' ' + (info.mLevel + 1) + '阶';
        this.showCurAttrs(curConfig);
        this.showNextAttrs(nextConfig);
        this.tpower.text = '战力+' + (GameGlobal.TianShenBaoQiModel.getPower(this.pos, info.mLevel) - GameGlobal.TianShenBaoQiModel.getPower(this.pos, info.mLevel - 1));

        this._UpdateExp();
    }

    private showCurAttrs(config) {
        if (!config) {
            this.curProLabel0.text = '0'
            this.curProLabel1.text = '0'
            this.curProLabel2.text = '0'
            return;
        }
        this.curProLabel0.text = AttributeData.getAttStrByType(config.attrs[0], 0, '+', false, '#ffffff');
        this.curProLabel1.text = AttributeData.getAttStrByType(config.attrs[1], 0, '+', false, '#ffffff');
        this.curProLabel2.text = AttributeData.getAttStrByType(config.attrs[2], 0, '+', false, '#ffffff');
    }

    private showNextAttrs(config) {
        if (!config) return;
        this.nextProLabel0.text = AttributeData.getAttStrByType(config.attrs[0], 0, '+', false, '#ffffff');
        this.nextProLabel1.text = AttributeData.getAttStrByType(config.attrs[1], 0, '+', false, '#ffffff');
        this.nextProLabel2.text = AttributeData.getAttStrByType(config.attrs[2], 0, '+', false, '#ffffff');
    }


    private _DoUpdateExp() {
        this.mRoleAutoSendData.Continue()
        this._UpdateExp()
    }

    private _UpdateExp() {
        let info = this.mModel.mTianShenBaoQiDatas[this.pos];
        let levelConfig = info.GetLevelConfig();
        if (!levelConfig) {
            return
        }
        this.bar.maximum = levelConfig.proexp
        this.bar.value = info.mExpUpNum * levelConfig.exp

        this.consumeLabel.Set(levelConfig.cost)
    }

    private _SendUp(): boolean {
        return this.mRoleSendCheckData.SendUp()
    }
}

class TianShenBaoQiHeadItem extends eui.Component {

    /////////////////////////////////////////////////////////////////////////////
    // PetHeadSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected item: ItemIcon;
    protected imgBattle: eui.Image;
    protected imgNotice: eui.Image;
    protected imgType: eui.Image;
    protected lbName: eui.Label;
    protected lbLev: eui.Label;
    protected lbLev2: eui.Label;
    protected redPoint: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    public pos: number;

    public isopen: boolean = false;

    public setData(config) {
        if (config) {
            this.pos = config.id;
            this.lbName.text = config.name;
            this.lbName.textColor = ItemBase.GetColorByQuality(3);
            let info = GameGlobal.TianShenBaoQiModel.mTianShenBaoQiDatas[config.id];
            this.lbLev.text = "";
            this.lbLev2.text = info.mLevel > 0 ? info.mLevel + "阶" : "";
            this.item.SetQuality(3)//(config.quality)
            this.item.setItemImg(config.icon + '');
            this.isopen = info.mLevel > 0;
            this.item.setGray(info.mLevel == 0);
        }
    }

    public updateLevel(lv) {
        this.lbLev2.text = lv + "阶";
    }
}