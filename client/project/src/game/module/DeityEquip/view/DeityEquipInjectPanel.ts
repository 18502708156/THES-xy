class DeityEquipInjectPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "注灵"

    /////////////////////////////////////////////////////////////////////////////
    // DeityEquipInjectSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected item0: DeityEquipItem;
    protected item1: DeityEquipItem;
    protected item2: DeityEquipItem;
    protected item3: DeityEquipItem;
    protected item4: DeityEquipItem;
    protected item5: DeityEquipItem;
    protected item6: DeityEquipItem;
    protected item7: DeityEquipItem;
    protected item8: DeityEquipItem;
    protected item9: DeityEquipItem;
    protected showItem: DeityEquipItem;
    protected labCurProp: eui.Label;
    protected labCurAttr1: eui.Label;
    protected labCurAttr2: eui.Label;
    protected labCurAttr3: eui.Label;
    protected labNextProp: eui.Label;
    protected labNextAttr1: eui.Label;
    protected labNextAttr2: eui.Label;
    protected labNextAttr3: eui.Label;
    protected groupCurSpecial: eui.Group;
    protected labCurSpecAttr: eui.Label;
    protected groupNextSpecial: eui.Group;
    protected labNextSpecAttr: eui.Label;
    protected needItemView: NeedItemView;
    protected getwayLabel: GainLabel;
    protected btnInject: eui.Button;
    protected labRateInfo: eui.Label;
    protected groupCur: eui.Group;
    protected groupUpgrade: eui.Group;
    protected labMax: eui.Label;
    protected groupProg: eui.Group;
    /////////////////////////////////////////////////////////////////////////////

    private mCurChooseIdx: number = 0
    private mTempInjectLv: number
    private mTempInjectNum: number
    private mProgEff: MovieClip

	public constructor() {
		super()
        this.skinName = "DeityEquipInjectSkin"
	}

    public childrenCreated() {
        for (let idx=0; idx<10; idx++)
        {
            this[`item${idx}`].name = `${idx}`
            this[`item${idx}`].UnshowDetail()
            this._AddClick(this[`item${idx}`], this._OnItemClick)
        }

        this.showItem.UnshowDetail()
        this._AddClick(this.btnInject, this._OnClicked)
        this.mCurChooseIdx = GameGlobal.UserEquip.GetDeityEquipPos()
    }

    public UpdateContent() {
        this.SetEquipList()
        this.ChooseEquip()
        this.UpdateRedPoint()
    }

	public OnOpen() {
        this.observe(MessageDef.CHANGE_EQUIP, this.UpdateInfo)
        this.InitProgEff()
	}

	public OnClose() {
        
	}

    private UpdateInfo() {
        this.ChooseEquip()
        this.UpdateRedPoint()
    }

    private SetEquipList() {
        let roleModel = GameGlobal.SubRoles.GetRoleData()
        for (let idx=0; idx<10; idx++) 
        {
            let equipData = roleModel.getEquipByIndex(idx)
            this[`item${idx}`].SetItemInfo(equipData, idx)
        }
    }

    private ChooseEquip() {
        this.SetPopTip()

        this[`item${this.mCurChooseIdx}`].ChooseItem(true)
        let roleModel = GameGlobal.SubRoles.GetRoleData()
        let equipData = roleModel.getEquipByIndex(this.mCurChooseIdx)
        this.showItem.SetItemInfo(equipData, this.mCurChooseIdx, true)
        this.showItem.SetModel(roleModel)

        let injectLv = equipData.deityEquipData.injectLevel
        let [perNum, maxProg] = DeityEquipConst.GetInjectProgInfo(this.mCurChooseIdx, injectLv+1)
        this.SetProg(Math.floor(equipData.deityEquipData.injectNum * perNum * 100 / maxProg))
        let text = DeityEquipConst.GetRateText(equipData.deityEquipData.injectNum)
        this.labRateInfo.textFlow = TextFlowMaker.generateTextFlow(text)
        
        let [textList, specialText] = DeityEquipConst.GetInjectAttrText(this.mCurChooseIdx, injectLv)
        this.labCurAttr1.text = injectLv == 0 ? "未激活" : textList[0] || ""
        this.labCurAttr2.text = injectLv == 0 ? "未激活" : textList[1] || ""
        this.labCurAttr3.text = injectLv == 0 ? "未激活" : textList[2] || ""
        this.labCurAttr1.textColor = injectLv == 0 ? Color.White : 0xfff01e
        this.labCurAttr2.textColor = injectLv == 0 ? Color.White : 0xfff01e
        this.labCurAttr3.textColor = injectLv == 0 ? Color.White : 0xfff01e
        this.labCurProp.text = injectLv > 0 ? `+${injectLv} 当前属性` : `当前属性`
        this.groupCurSpecial.visible = specialText != null
        this.labCurSpecAttr.text = specialText || ""

        if (DeityEquipConst.IsMaxInjectLevel(this.mCurChooseIdx, injectLv))
        {
            this.groupCur.x = 284
            this.groupUpgrade.visible = false
            this.labMax.visible = true
            return
        }

        this.groupCur.x = 164
        this.groupUpgrade.visible = true
        this.labMax.visible = false
        let [nextTextList, nextSpecialText] = DeityEquipConst.GetInjectAttrText(this.mCurChooseIdx, injectLv+1)
        this.labNextAttr1.text = nextTextList[0] || ""
        this.labNextAttr2.text = nextTextList[1] || ""
        this.labNextAttr3.text = nextTextList[2] || ""
        this.labNextProp.text = `+${injectLv+1} 下级属性`
        this.groupNextSpecial.visible = nextSpecialText != null
        this.labNextSpecAttr.text = nextSpecialText || ""

        let cost = DeityEquipConst.GetInjectCost(this.mCurChooseIdx, injectLv+1)
        if (!cost)
            return

        this.needItemView.SetItemId(cost.id, cost.count)
        this.getwayLabel.SetId(cost.id)
    }

    private UpdateRedPoint() {
        for (let idx=0; idx<10; idx++) 
            UIHelper.ShowRedPoint(this[`item${idx}`], GameGlobal.UserEquip.CanTheDeityEquipInject(idx))
    }

    private _OnItemClick(e: egret.TouchEvent) {
		let curChooseIdx = parseInt(e.currentTarget.name)

        let roleModel = GameGlobal.SubRoles.GetRoleData()
        let equipData = roleModel.getEquipByIndex(curChooseIdx)
        let curId = equipData.item.configID

        if (!DeityEquipConst.IsDeityEquip(curId))
        {
            UserTips.ins().showTips("穿戴神装才可以进行注灵")
            return
        }

        this[`item${this.mCurChooseIdx}`].ChooseItem(false)
        this.mCurChooseIdx = curChooseIdx
        this.mTempInjectLv = null
        this.mTempInjectNum = null
        this.ChooseEquip()
    }

    private _OnClicked() {
        let roleModel = GameGlobal.SubRoles.GetRoleData()
        let equipData = roleModel.getEquipByIndex(this.mCurChooseIdx)
        let curId = equipData.item.configID
        let injectLv = equipData.deityEquipData.injectLevel
        let cost = DeityEquipConst.GetInjectCost(this.mCurChooseIdx, injectLv+1)
        if (!Checker.Data(cost))
            return

        GameGlobal.UserEquip.SendDeityEquipInjectSoul(this.mCurChooseIdx, 0)
    }

    private SetPopTip() {
        let roleModel = GameGlobal.SubRoles.GetRoleData()
        let equipData = roleModel.getEquipByIndex(this.mCurChooseIdx)
        let curInjectNum = equipData.deityEquipData.injectNum
        let curInjectLevel = equipData.deityEquipData.injectLevel
        if (!this.mTempInjectNum)
        {
            this.mTempInjectLv = curInjectLevel
            this.mTempInjectNum = curInjectNum
            return
        }
        
        let deltaNum = DeityEquipConst.GetDeltaNum(this.mCurChooseIdx, this.mTempInjectNum, this.mTempInjectLv, curInjectNum, curInjectLevel)
        this.mTempInjectLv = curInjectLevel
        this.mTempInjectNum = curInjectNum

        if (curInjectNum == 0)
        {
            this.ShowUpLvEff()
        }

        let lab = new eui.Label
        lab.text = `+${deltaNum}`
        lab.textColor = Color.Green
        lab.x = 110
        lab.y = 100
        this.groupProg.addChild(lab)

        var t = egret.Tween.get(lab);
		t.to({ "y": 30 }, 300).wait(200).to({ "alpha": 0 }, 100).call(() => {
			this.groupProg.removeChild(lab)
		})
    }

    private InitProgEff() {
        if (this.mProgEff)
            return
            
        let shape = new egret.Shape
        shape.graphics.beginFill(0xffffff, 1)
        shape.graphics.drawCircle(121, 97, 49)
        shape.graphics.endFill()
        this.groupProg.addChild(shape)
        
        this.mProgEff = new MovieClip
        this.mProgEff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jiexi002"), true, -1)
        this.mProgEff.x = 121
        this.mProgEff.y = 210
        this.mProgEff.mask = shape
        this.groupProg.addChild(this.mProgEff)
    }

    private SetProg(percent) {
        this.mProgEff.y = 210 - percent
    }

    private ShowUpLvEff() {
        let eff = new MovieClip
        eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jiexi003"), true, 1)
        eff.x = 121
        eff.y = 97
        this.groupProg.addChild(eff)
    }
}
