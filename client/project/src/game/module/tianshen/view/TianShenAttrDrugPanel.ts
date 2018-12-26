class TianShenAttrDrugPanel  extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	protected mModel: TianShenModel

	public constructor() {
		super()
		this.skinName = "RoleRideDrugSkin"
	}

    /////////////////////////////////////////////////////////////////////////////
    // RoleRideDrugSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected commonDialog: CommonDialog;
    protected matLabel: eui.Label;
    protected useCountLabel: eui.Label;
    protected item: ItemIcon;
    protected attrLabel: eui.Label;
    protected getwayLabel: eui.Label;
    protected countLabel: eui.Label;
    protected add: eui.Group;
    protected numLabel: eui.TextInput;
    protected minBtn: eui.Button;
    protected maxBtn: eui.Button;
    protected btnLessTen: eui.Button;
    protected btnAddTen: eui.Button;
    protected useBtn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private useNum = 0;

	public childrenCreated() {

		this.mModel = GameGlobal.TianShenModel;

		this.numLabel.text = this.useNum + ""
		this.numLabel.inputType = egret.TextFieldInputType.TEL
		this.numLabel.restrict = "0-9"
		this.numLabel.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		this._AddClick(this.minBtn, this._OnClick)
		this._AddClick(this.maxBtn, this._OnClick)
		this._AddClick(this.btnLessTen, this._OnClick)
		this._AddClick(this.btnAddTen, this._OnClick)
		this._AddClick(this.getwayLabel, this._OnClick)
		this._AddClick(this.useBtn, this._OnClick)
		UIHelper.SetLinkStyleLabel(this.getwayLabel)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.minBtn:
				this.ChangeCount(-1)
			break
			case this.maxBtn:
				this.ChangeCount(+1)
			break
			case this.btnLessTen:
				this.ChangeCount(-10)
			break
			case this.btnAddTen:
				this.ChangeCount(+10)
			break
			case this.getwayLabel:
			break
			case this.useBtn:
				let curCount = GameGlobal.UserBag.GetCount(this.mModel.getBaseConfig().attreitemid)
				if (curCount > 0)
					this.mModel.SendUseDrug(this.useNum)
				else
					UserTips.ins().showTips("|C:0xff0000&T:属性丹数量不足，无法使用|")
			break
		}
	}

	onTxtChange(e) {
		var num = parseInt(this.numLabel.text);
		this.useNum = 0
		this.ChangeCount(num)
	};

	private ChangeCount(count: number) {
		this.useNum = MathUtils.Clamp(this.useNum + count, 0, GameGlobal.UserBag.GetCount(this.mModel.getBaseConfig().attreitemid))
		this.numLabel.text = this.useNum + ""
	}

	public UpdateContent() {
		let config = GameGlobal.Config.ItemConfig[this.mModel.getBaseConfig().attreitemid]
		this.item.setData(config)
		this.matLabel.text = config.name

		let drugNum = this.mModel.mDrugNum
		UIHelper.SetLabelText(this.countLabel, "当前背包拥有：", GameGlobal.UserBag.GetCount(this.mModel.getBaseConfig().attreitemid) + "个")
		UIHelper.SetLabelText(this.useCountLabel, "已使用：", drugNum + "个")
		let attr = this.mModel.GetCurDrugAttr()
		this.attrLabel.textFlow = AttributeData.GetAttrTabString(attr)
	}

	public UpdateDrug() {
		this.useNum = 0
		this.ChangeCount(0)
	}

	public OnOpen(...param: any[]) {
		this.observe(MessageDef.TIANSHEN_UPDATE_INFO, this.UpdateContent)
		this.observe(MessageDef.TIANSHEN_UPDATE_DRUG, this.UpdateDrug)
		this.UpdateContent()
		this.commonDialog.OnAdded(this)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}