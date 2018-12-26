class RoleTemplateDrugPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	protected mModel: UserTemplate

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
    protected item: ItemBaseNotName;
    protected labTip: eui.Label;
    protected attrLabel: eui.Label;
    protected countLabel: eui.Label;
    protected add: eui.Group;
    protected numLabel: eui.TextInput;
    protected minBtn: eui.Button;
    protected maxBtn: eui.Button;
    protected btnLessTen: eui.Button;
    protected btnAddTen: eui.Button;
    protected useBtn: eui.Button;
    protected getwayLabel: GainLabel;
    /////////////////////////////////////////////////////////////////////////////

	private useNum = 0;

	public childrenCreated() {

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
		// UIHelper.SetLinkStyleLabel(this.getwayLabel)
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
			// case this.getwayLabel:
			// 	break
			case this.useBtn:
				let curCount = GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid)
				if (curCount > 0)
					this.mModel.SendDrug(this.useNum)
				else
					UserTips.ins().showTips("|C:0xff0000&T:属性丹数量不足，无法使用|")
				break
		}
	}

	onTxtChange(e) {
		var num = parseInt(this.numLabel.text);
		this.useNum = GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid);
		this.ChangeCount(num)
	};

	private ChangeCount(count: number) {
		this.useNum = MathUtils.Clamp(this.useNum + count, 0, GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid))
		this.numLabel.text = this.useNum + ""
	}

	public UpdateContent() {
		let config = GameGlobal.Config.ItemConfig[this.mModel.BaseConfig.attreitemid]
		this.item.data = this.mModel.BaseConfig.attreitemid
		this.matLabel.text = config.name

		let drugNum = this.mModel.mDrugNum
		UIHelper.SetLabelText(this.countLabel, "当前背包拥有：", GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid) + "个")
		UIHelper.SetLabelText(this.useCountLabel, "已使用：", drugNum + "个")
		// let attr = CommonUtils.copyDataHandler(this.mModel.BaseConfig.attredata)
		// for (let k in attr) {
		// 	attr[k].value *= drugNum
		// }
		let attr = this.mModel.GetCurDrugAttr()
		this.attrLabel.textFlow = AttributeData.GetAttrTabString(attr)
	}

	public UpdateDrug() {
		this.useNum = GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid);
		this.ChangeCount(0)
	}

	public OnOpen(...param: any[]) {
		this.mModel = param[0]
		this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent)
		this.observe(this.mModel.mMsgDefUpdateDrug, this.UpdateDrug)
		this.UpdateContent()
		this.commonDialog.OnAdded(this)
		this.useNum = GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid);
		this.numLabel.text = this.useNum + ""

		this.getwayLabel.SetId(this.mModel.BaseConfig.attreitemid)
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}