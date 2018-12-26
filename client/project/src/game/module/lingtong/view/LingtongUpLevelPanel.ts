class LingtongUpLevelPanel extends BaseView implements ICommonWindowTitle {

    public static NAME = "升阶"

    /////////////////////////////////////////////////////////////////////////////
    // LingtongUpLevelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected powerLabel: PowerLabel;
    protected nameBg: eui.Image;
    protected showPanel: RoleShowPanel;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected lbName: eui.Label;
    protected lbLev: eui.Label;
    protected lbFull: eui.Label;
    protected btnSkin: eui.Button;
    protected btnAttrDrug: eui.Button;
    protected btn_juexing: eui.Button;
    protected btnCulture: eui.Button;
    protected btnAuto: eui.Button;
    protected checkBox: eui.CheckBox;
    protected consumeLabel: ConsumeTwoLabel;
    protected btnRename: eui.Button;
    protected btnShow: eui.Button;
    protected skillComp: eui.Component;
    protected skillList: eui.List;
    // protected itemGroup: eui.Group
    /////////////////////////////////////////////////////////////////////////////

    protected mModel: UserTemplate = GameGlobal.LingtongModel
    protected mModelRedPoint = GameGlobal.LingtongModel.mRedPoint

    private mShowLevel: number = 0
    private mRoleAutoSendData: RoleAutoSendData
    private mRoleSendCheckData: RoleSendCheckData


    // public static RedPointCheck(): boolean {
    //     return GameGlobal.UserRide.mRedPoint.IsRedPoint()
    // }

    public constructor() {
        super()
        this.skinName = "LingtongUpLevelSkin"
        this.skillList.itemRenderer = LinglongSkillItem
        this.mRoleAutoSendData = new RoleAutoSendData(() => {
            if (!this.SendUp()) {
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
                this.mModel.SendBoost(type)
            }
        }, () => {
            let model = this.mModel
            let levelConfig = this.mModel.LvproConfig[model.mLevel]
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
        this.lbFull.text = this.name + "已满阶"
    }

    public childrenCreated() {
        this._AddClick(this.btnCulture, this._OnClick)
        this._AddClick(this.btnAuto, this._OnClick)
        this._AddClick(this.btnAttrDrug, this._OnClick)
        this._AddClick(this.powerLabel, this._OnClick)
        this._AddClick(this.btnSkin, this._OnClick)
        this._AddClick(this.btn_juexing, this._OnClick)
        this._AddClick(this.btnRename, this._OnClick)
        this._AddClick(this.skillComp, this._OnClick)
        this._AddItemClick(this.skillList, this._OnItemClick)
    }

    public OnOpen() {
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent)
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent)
        this.observe(this.mModel.mMsgDefUpdateExp, this.UpdateExp)
        this.observe(this.mModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
        this.observe(this.mModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
        this.observe(this.mModel.GetItemRankItemUpdateMsg(), this.UpdateItemContent)
        // this.observe(MessageDef.DESTINY_CHANGE, this.UpdateEquip)
        // this.observe(MessageDef.DESTINY_RP, this.UpdateEquip)
        // this.UpdateEquip()

        this.mShowLevel = this.mModel.mLevel
        if (!this.mShowLevel) {
            return
        }
        this.UpdateModel(Math.max(this.mShowLevel, 1))
        this.UpdateContent()
        this.UpdateRedPoint()

        // this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent)
        // this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent)
        // this.observe(this.mModel.mMsgDefUpdateExp, this.UpdateExp)
        // this.observe(this.mModel.GetItemRpUpdateMsg(), this.UpdateRedPoint)
        // this.observe(this.mModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint)
        // this.observe(this.mModel.GetItemRankItemUpdateMsg(), this.UpdateItemContent)

        // this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent)//背包变化更新
    }

    public OnClose() {
        this.mRoleAutoSendData.Stop()
    }

	// private UpdateEquip() {
	// 	let datas = GameGlobal.DestinyController.getUseDestinyData()
	// 	let i = 0
	// 	for (let i = 0; i < 6; i++) {
	// 		let data = datas[i]
	// 		let item = this.itemGroup.getChildAt(i)	as DestinySItem
	// 		if (item) {
	// 			item.onUpdate(i, data)
	// 		}
	// 	}
	// }

    private _OnItemClick(e: eui.ItemTapEvent) {
        if (!e.item) {
            return
        }
        if (e.itemIndex == 0) {
            ViewManager.ins().open(PetSkillTipPanel, 0, e.item)
        } else {
            ViewManager.ins().open(PetSkillTipPanel, 2, e.item)
        }
    }

    private _OnClick(e: egret.TouchEvent) {
        switch (e.currentTarget) {
            case this.skillComp:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.LingtongAttrModel.GetSkillId())
                break
            case this.btnCulture:
                this.SendUp()
                break
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle()
                break
            case this.btnAttrDrug:
                ViewManager.ins().open(RoleTemplateDrugPanel, this.mModel)
                break
            case this.powerLabel:
                ViewManager.ins().open(LingTongRoleTemplateAttrPanel, this.mModel, "灵童", this.mModel.GetLevelSkin(this.mShowLevel))
                break
            case this.btnSkin:
                ViewManager.ins().open(RoleRideDressPanel, this.mModel)
                break
            case this.btn_juexing:
                ViewManager.ins().open(RoleTemplateRewardPanel, this.mModel.mTemplateType)
                break
            case this.btnRename:
                ViewManager.ins().open(PetChangeNamePanel, "灵童改名",MessageDef.LINGTONG_UPDATE_INFO, GameGlobal.LingtongAttrModel.mName, (name) => {
                    GameGlobal.LingtongAttrModel.SendRename(name)
                }, this)
                break
        }
    }

    private SendUp() {
        return this.mRoleSendCheckData.SendUp()
    }

    public UpdateExp(upLevel: boolean): void {
        if (upLevel || this.mShowLevel == 0) {
            this.UpdateModel(this.mShowLevel + 1)
            // this.mRoleAutoSendData.Stop()
        } 
        // else {
            this.mRoleAutoSendData.Continue()
        // }
    }

    UpdateContent(): void {
        let model = this.mModel
        if (!GameGlobal.LingtongAttrModel.IsActive()) {
            return
        }
        // PetSkillIconItem.SetContent(this.skillComp as any, GameGlobal.LingtongAttrModel.GetSkillId(), 0)

		let list = [GameGlobal.LingtongAttrModel.GetSkillId()]
		for (let id of GameGlobal.LingtongAttrModel.mBuffSkill) {
			list.push(id)
		}
		for (let i = list.length; i < PetModel.SKILL_COUNT; i++) {
			list.push(null)
		}
		this.skillList.dataProvider = new eui.ArrayCollection(list)
        this.skillList.validateNow()
        for (let i = 0; i < this.skillList.numChildren; i++) {
            let item = this.skillList.getChildAt(i) as LinglongSkillItem
            if (!item.mIsLock) {
                item.skillName.visible = false
            }
        }


        // let config = GameGlobal.Config.BabyBasisConfig.openSkill
		// 	if(config[this.itemIndex])
		// 	{
		// 		str = config[this.itemIndex]+ "阶解锁"
		// 	}
        
        this.powerLabel.text = model.GetDescPower() + GameGlobal.DestinyController.GetPower()

        if (!model.mLevel) {
            this.currentState = "none"
            return
        }
        if (this.mModel.mLevel >= this.mModel.mMaxLevel) {
            this.currentState = "full"
        } else {
            this.currentState = "normal"
        }
        let levelConfig = this.mModel.LvproConfig[model.mLevel]
        if (!levelConfig) {
            return
        }
        this.bar.maximum = levelConfig.proexp
        this.bar.value = model.mUpNum * levelConfig.exp

        this.UpdateItemContent()
        this.UpdateModel(this.mShowLevel)
    }

    private UpdateItemContent() {
        let levelConfig = this.mModel.LvproConfig[this.mModel.mLevel]
        if (!levelConfig) {
            return
        }
        this.consumeLabel.Set(levelConfig.cost)
    }

    private UpdateRedPoint() {
        if (this.btnSkin.visible) {
            UIHelper.ShowRedPoint(this.btnSkin, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_SKIN))
        }
        UIHelper.ShowRedPoint(this.btnAttrDrug, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_ATTR_ITEM))
        UIHelper.ShowRedPoint(this.btn_juexing, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_REWARD))

        UIHelper.ShowRedPoint(this.btnAuto, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_RANK))
        UIHelper.ShowRedPoint(this.btnCulture, this.mModelRedPoint.Get(UserTemplateRedPoint.INDEX_RANK))
    }

    private UpdateModel(level: number) {
        let model = this.mModel
        this.mShowLevel = level
        this.lbName.text = GameGlobal.LingtongAttrModel.mName || ""
        this.lbLev.text = level + "\n阶"
        LingtongViewHelper.SetRole(this.showPanel)
    }

    public static RedPointCheck(): boolean {
        return GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_ACTIVE) || GameGlobal.LingtongModel.mRedPoint.IsRedPoint()
    }
}
