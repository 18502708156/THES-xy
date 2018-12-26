class DeityEquipAwakePanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "觉醒"

    /////////////////////////////////////////////////////////////////////////////
    // DeityEquipAwakeSkin.exml
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
    protected itemCur: DeityEquipItem;
    protected itemNext: DeityEquipItem;
    protected labCurAttr1: eui.Label;
    protected labCurAttr2: eui.Label;
    protected labCurAttr3: eui.Label;
    protected labNextAttr1: eui.Label;
    protected labNextAttr2: eui.Label;
    protected labNextAttr3: eui.Label;
    protected needItemView: NeedItemView;
    protected getwayLabel: GainLabel;
    protected btnAwake: eui.Button;
    protected groupCur: eui.Group;
    protected groupUpgrade: eui.Group;
    protected labMax: eui.Label;
    protected groupEff: eui.Group;
    protected labResolve: eui.Label;
    protected imgRed: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

    private mCurChooseIdx: number = 0
    private mAwakeFlag: boolean = false

	public constructor() {
		super()
        this.skinName = "DeityEquipAwakeSkin"
	}

    public childrenCreated() {
        for (let idx=0; idx<10; idx++)
        {
            this[`item${idx}`].name = `${idx}`
            this[`item${idx}`].UnshowDetail()
            this._AddClick(this[`item${idx}`], this._OnItemClick)
        }

        this.itemCur.UnshowDetail()
        this._AddClick(this.btnAwake, this._OnClicked)
        this._AddClick(this.labResolve, this._OnTap)
    }

    public UpdateContent() {
        this.SetEquipList()
        this.ChooseEquip()
        this.UpdateRedPoint()
        this.ShowAwakeEff()
    }

	public OnOpen() {
        this.observe(MessageDef.CHANGE_EQUIP, this.UpdateContent)
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent)

        UIHelper.SetLinkStyleLabel(this.labResolve)
	}

	public OnClose() {
        
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
        this[`item${this.mCurChooseIdx}`].ChooseItem(true)
        let roleModel = GameGlobal.SubRoles.GetRoleData()
        let equipData = roleModel.getEquipByIndex(this.mCurChooseIdx)
        this.itemCur.SetItemInfo(equipData, this.mCurChooseIdx, true)
        this.itemCur.SetModel(roleModel)

        let curId = equipData.item.configID
        let deityEquipFlag = DeityEquipConst.IsDeityEquip(curId)
        let textList = DeityEquipConst.GetEquipAttrText(curId)
        this.labCurAttr1.text = deityEquipFlag ? textList[0] || "" : "未觉醒"
        this.labCurAttr2.text = deityEquipFlag ? textList[1] || "" : "未觉醒"
        this.labCurAttr3.text = deityEquipFlag ? textList[2] || "" : "未觉醒"
        this.labCurAttr1.textColor = deityEquipFlag ? 0xfff01e : Color.White
        this.labCurAttr2.textColor = deityEquipFlag ? 0xfff01e : Color.White
        this.labCurAttr3.textColor = deityEquipFlag ? 0xfff01e : Color.White

        if (DeityEquipConst.IsMaxAwakeLevel(curId))
        {
            this.groupCur.x = 284
            this.labMax.visible = true
            this.groupUpgrade.visible = false
            return
        }

        this.groupCur.x = 151
        this.labMax.visible = false
        this.groupUpgrade.visible = true

        let nextEquipId = DeityEquipConst.GetNextDeityEquipId(curId, this.mCurChooseIdx)
        this.itemNext.SetItemConfigId(nextEquipId)
        let nextTextList = DeityEquipConst.GetEquipAttrText(nextEquipId)
        this.labNextAttr1.text = nextTextList[0] || ""
        this.labNextAttr2.text = nextTextList[1] || ""
        this.labNextAttr3.text = nextTextList[2] || ""

        this.btnAwake.label = DeityEquipConst.IsDeityEquip(curId) ? "觉醒" : "合成"
        let cost = DeityEquipConst.GetAwakeCost(curId, this.mCurChooseIdx)
        if (!cost)
            return

        this.needItemView.SetItemId(cost.id, cost.count)
        this.getwayLabel.SetId(cost.id)
    }

    private _OnItemClick(e: egret.TouchEvent) {
        this[`item${this.mCurChooseIdx}`].ChooseItem(false)
		this.mCurChooseIdx = parseInt(e.currentTarget.name)
        this.ChooseEquip()
    }

    private UpdateRedPoint() {
        this.imgRed.visible = GameGlobal.UserEquip.HasDeityEquipResolve()
        for (let idx=0; idx<10; idx++) 
            UIHelper.ShowRedPoint(this[`item${idx}`], GameGlobal.UserEquip.CanTheDeityEquipAwake(idx))
    }

    private ShowAwakeEff() {
        if (!this.mAwakeFlag)
            return

        let eff = new MovieClip
        eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jiexi001"), true, 1)
        this.groupEff.addChild(eff)
        this.mAwakeFlag = false
    }

    private _OnTap() {
        ViewManager.ins().open(DeityEquipResolveWin)
    }

    private _OnClicked() {
        let roleModel = GameGlobal.SubRoles.GetRoleData()
        let equipData = roleModel.getEquipByIndex(this.mCurChooseIdx)
        let curId = equipData.item.configID
        let nextEquipId = DeityEquipConst.GetNextDeityEquipId(curId, this.mCurChooseIdx)
        let nextConfig = GameGlobal.Config.ItemConfig[nextEquipId]
        if (nextConfig && nextConfig.level > GameGlobal.actorModel.level)
        {
            UserTips.ins().showTips("等级不足，不可以觉醒该装备")
            return
        }
        
        let cost = DeityEquipConst.GetAwakeCost(curId, this.mCurChooseIdx)
        if (!Checker.Data(cost))
            return

        if (!DeityEquipConst.IsDeityEquip(curId)) 
        {
            GameGlobal.UserEquip.SendComposeDeityEquip(this.mCurChooseIdx)
        }
        else
        {
            this.mAwakeFlag = true
            GameGlobal.UserEquip.SendDeityEquipAwake(this.mCurChooseIdx)
        }
    }
}
