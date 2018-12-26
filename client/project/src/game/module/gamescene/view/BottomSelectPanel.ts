class BottomSelectPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup

    /////////////////////////////////////////////////////////////////////////////
    // BottomSelectPanelSkins.exml
    /////////////////////////////////////////////////////////////////////////////
    protected anim: egret.tween.TweenGroup;
    protected conGroup: eui.Group;
    protected btnGroup: eui.Group;
    protected lingtongBtn: eui.ToggleButton;
    protected lingtongBtnline: eui.Image;
    protected xiannvBtn0: eui.ToggleButton;
    protected tianvBtnline: eui.Image;
    protected tianvBtn: eui.ToggleButton;
    protected tianshenBtnline: eui.Image;
    protected tianshenBtn: eui.ToggleButton;
    /////////////////////////////////////////////////////////////////////////////

	private navBind: Array<Function>;
	private navBtn: Array<eui.ToggleButton>;

	public constructor() {
		super();
		this.skinName = "BottomSelectPanelSkins";
		this.navBtn = [this.tianvBtn, this.xiannvBtn0, this.tianshenBtn, this.lingtongBtn];
		this.navBind = [HavingMainPanel, XianlvMainPanel, TianShenMainPanel, LingtongMainPanel];
	}

	public destoryView() {}

	OnOpen(...param: any[]) {

		this.parent.globalToLocal(0, GameGlobal.StageUtils.GetHeight() - 130, egret.$TempPoint)
		this.conGroup.y = egret.$TempPoint.y

		this.ShowCount()
		for (var i = 0; i < this.navBtn.length; i++) {
			this.navBtn[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		}
		this.observe(GameGlobal.XianlvFzModel.GetItemRpUpdateMsg(), this.UpdateXianlvRedPoint)
		this.observe(GameGlobal.XianlvFzModel.GetItemEquipRpUpdateMsg(), this.UpdateXianlvRedPoint)
		this.observe(GameGlobal.XianlvXwModel.GetItemRpUpdateMsg(), this.UpdateXianlvRedPoint)
		this.observe(GameGlobal.XianlvXwModel.GetItemEquipRpUpdateMsg(), this.UpdateXianlvRedPoint)
		this.observe(MessageDef.RP_BAG_XIANLV_ACT_ITEM, this.UpdateXianlvRedPoint)
		this.observe(MessageDef.RP_XIANLV, this.UpdateXianlvRedPoint)
		this.observe(MessageDef.YUANFEN_ALL_NOTICE, this.UpdateXianlvRedPoint)
		this.UpdateXianlvRedPoint()

		this.observe(GameGlobal.HavingModel.GetItemRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingModel.GetItemEquipRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingHuanModel.GetItemRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingHuanModel.GetItemEquipRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingLingqModel.GetItemRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.observe(GameGlobal.HavingLingqModel.GetItemEquipRpUpdateMsg(), this.UpdateTiannvRedPoint)
		this.UpdateTiannvRedPoint()

		this.observe(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM, this.UpdateTiansRedPoint)
		this.observe(MessageDef.RP_TIANSHEN, this.UpdateTiansRedPoint)
		this.observe(MessageDef.YUANFEN_ALL_NOTICE, this.UpdateTiansRedPoint)
		this.UpdateTiansRedPoint()

		this.observe(GameGlobal.LingtongModel.GetItemRpUpdateMsg(), this.UpdateLigntongRedPoint)
		this.observe(GameGlobal.LingtongModel.GetItemEquipRpUpdateMsg(), this.UpdateLigntongRedPoint)
		this.observe(MessageDef.RP_LINGTONG, this.UpdateLigntongRedPoint)
		this.UpdateLigntongRedPoint()
		this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng)

		this.anim.play(0)
	}

	OnClose() {
	}

	public ShowCount() {
		let tiansState = Deblocking.Check(DeblockingType.TYPE_23, true)
		UIHelper.SetVisible(this.tianshenBtn, tiansState)
		UIHelper.SetVisible(this.tianshenBtnline, tiansState)

		let tiannvState = Deblocking.Check(DeblockingType.TYPE_19, true)
		UIHelper.SetVisible(this.tianvBtn, tiannvState)
		UIHelper.SetVisible(this.tianvBtnline, tiannvState)

		let lingtState = Deblocking.Check(DeblockingType.TYPE_116, true)
		UIHelper.SetVisible(this.lingtongBtn, lingtState)
		UIHelper.SetVisible(this.lingtongBtnline, lingtState)

		UIHelper.SetVisible(this.xiannvBtn0, true)
		this.btnGroup.horizontalCenter = tiansState && tiannvState && lingtState ? -73 : 0

		let state = tiansState || tiannvState || lingtState
		return state
	}

	public updateJiJieBtnPng(): void {
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.tianvBtn, [ActivityKaiFuJiJieType.tiannv_nimbus, ActivityKaiFuJiJieType.tiannv_flower]);
		ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.xiannvBtn0, [ActivityKaiFuJiJieType.xianlv_circle, ActivityKaiFuJiJieType.xianlv_position]);
	}

	public onClick(e: egret.TouchEvent) {
		var index = this.navBtn.indexOf(e.currentTarget);
		let navCls = this.navBind[index]
		if (navCls) {
			if (ViewManager.ins().isShow(navCls)) {
				ViewManager.ins().close(navCls)
			} else {
				ViewManager.ins().open(navCls);
				ViewManager.ins().close(this)
			}
		}
	}


	private GetXianlvRedPoint(): boolean {
		if (GameGlobal.XianlvModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.XianlvFzModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.XianlvXwModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.YuanfenModel.IsRedPoint()) {
			return true
		}
		return false
	}



	private UpdateXianlvRedPoint() {
		UIHelper.ShowRedPoint(this.xiannvBtn0, this.GetXianlvRedPoint())
	}

	private GetTiannvRedPoint() {
		if (GameGlobal.HavingModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.HavingHuanModel.mRedPoint.IsRedPoint()) {
			return true
		}
		if (GameGlobal.HavingLingqModel.mRedPoint.IsRedPoint()) {
			return true
		}
		return false
	}

	private UpdateTiannvRedPoint() {
		UIHelper.ShowRedPoint(this.tianvBtn, this.GetTiannvRedPoint())
	}

	private UpdateTiansRedPoint() {
		UIHelper.ShowRedPoint(this.tianshenBtn, GameGlobal.TianShenModel.mRedPoint.IsRedPoint() || GameGlobal.YuanfenModel.IsRedPoint())
	}

	private UpdateLigntongRedPoint() {
		UIHelper.ShowRedPoint(this.lingtongBtn, GameGlobal.LingtongAttrModel.IsRedPoint())
	}
}