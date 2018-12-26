class LingtongRankPanel extends BaseView implements ICommonWindowTitle {
	public static NAME = "天赋"
    /////////////////////////////////////////////////////////////////////////////
    // LingtongRankSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected powerLabel: PowerLabel;
    protected nameBg: eui.Image;
    protected lbName: eui.Label;
    protected lbLev: eui.Label;
    protected skillIcon: eui.Component;
    protected skinAttr: eui.Label;
    protected infoGroup: eui.Group;
    protected bar: eui.ProgressBar;
    protected thumb: eui.Image;
    protected labelDisplay: eui.Label;
    protected needItemView: NeedItemView;
    protected getwayLabel: GainLabel;
    protected btnCulture: eui.Button;
    protected btnAuto: eui.Button;
    protected lbFull: eui.Label;
    protected petShowPanel0: RoleShowPanel;
    protected leftComp: eui.Component;
    protected rightComp: eui.Component;
    protected arrImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    private mRoleAutoSendData: RoleAutoSendData
    private mRoleSendCheckData: RoleSendCheckData

	public constructor() {
		super()
		this.skinName = "LingtongRankSkin"

		this.GainWay()

		this._AddClick(this.skillIcon, this._OnItemClick)
		this._AddClick(this.btnAuto, this._OnItemClick)
		this._AddClick(this.btnCulture, this._OnItemClick)


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
			GameGlobal.LingtongAttrModel.SendAddGift()
        }, () => {
			let model = GameGlobal.LingtongAttrModel
			if (model.giftlv >= model.MAX_GIFT_LEVEL) {
				return [null]
			}
			let config = GameGlobal.Config.BabyTalentConfig[model.mSex][model.giftlv - 1]
			if (!config) {
				return
			}
			return [null, null, config.cost[0].id, config.cost[0].count]
        }, () => {
            return false
        }, () => {
            this.mRoleAutoSendData.Toggle()
        })

	}

	private SendUp() {
        return this.mRoleSendCheckData.SendUp()
	}

	public childrenCreated() {
	}

	public OnOpen() {
		this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent)
		this.observe(MessageDef.LINGTONG_UPDATE_GIFT_INFO, this.UpdateRank)
		this.UpdateContent()

		this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint)
		this.UpdateRedPoint()

		this.lbName.text = GameGlobal.LingtongAttrModel.mName
		LingtongViewHelper.SetRole(this.petShowPanel0)
	}

	public OnClose() {
		this.mRoleAutoSendData.Stop()
	}

	private UpdateRedPoint() {
		UIHelper.ShowRedPoint(this.btnAuto, GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_RANK))
		UIHelper.ShowRedPoint(this.btnCulture, GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_RANK))
	}

	private UpdateRank() {
		this.mRoleAutoSendData.Continue()
		this.UpdateContent()
	}

	public UpdateContent() {
		let model = GameGlobal.LingtongAttrModel
		if (!model.IsActive()) {
			return
		}
		let config = GameGlobal.Config.BabyTalentConfig[model.mSex][model.giftlv - 1]
		if (!config) {
			return
		}
		this.SetSkillDes(this.leftComp as any, GameGlobal.LingtongAttrModel.GetSkillId())
		
		PetSkillIconItem.SetContent(this.skillIcon as any, GameGlobal.LingtongAttrModel.GetSkillId(), 0)
		let attrs = GameGlobal.LingtongAttrModel.getTianFuAllAttr();
		this.skinAttr.textFlow = AttributeData.GetAttrTabString(attrs)
		this.powerLabel.text = UserBag.getAttrPower(attrs)
		this.lbLev.text = PetZizhiPanel.TYPE[model.giftlv]
		if (model.giftlv >= model.MAX_GIFT_LEVEL) {
			this.infoGroup.visible = false
			this.lbFull.visible = true

			this.leftComp.x = 229
			this.arrImg.visible = false
			this.rightComp.visible = false

			return
		}

		this.leftComp.x = 34
		this.arrImg.visible = true
		this.rightComp.visible = true
		
		this.SetSkillDes(this.rightComp as any, GameGlobal.LingtongAttrModel.GetNextSkillId())

		this.bar.maximum = config.proexp
		this.bar.value = model.giftexp * config.exp

		this.needItemView.SetItemId(config.cost[0].id, config.cost[0].count)
	}

	private _OnItemClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.skillIcon:
				ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.LingtongAttrModel.GetSkillId())
				break
			case this.btnCulture:
                this.SendUp()
                break
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle()
                break
		}
	}

	private GainWay() {
		let model = GameGlobal.LingtongAttrModel
		if (!model.IsActive()) {
			return
		}
		let config = GameGlobal.Config.BabyTalentConfig[GameGlobal.LingtongAttrModel.mSex][model.giftlv - 1]
		if (!config) {
			return
		}
		let id = config.cost[0].id
		this.getwayLabel.SetId(id)
	}

	private SetSkillDes(comp: ILingtongSkillDecsSkin, skillId) {
		comp.iconImg.source = PetConst.GetSkillIcon(skillId)

		comp.skillName.text = PetConst.GetSkillName(skillId)
		let quality = PetConst.GetSkillQuality(skillId)
		comp.skillName.textColor = ItemBase.GetColorByQuality(quality)

		comp.skillDesc.text = PetConst.GetSkillDesc(skillId)	
	}

    public static RedPointCheck(): boolean {
        return GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_RANK)
    }
}

interface ILingtongSkillDecsSkin {
	/////////////////////////////////////////////////////////////////////////////
    // LingtongSkillDecsSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    iconImg: eui.Image;
    skillName: eui.Label;
    skillDesc: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

}