enum PlayFunTipBtnType {
	CATCH_PET = 0,	// 抓捕宝宝
	TEAM = 1,		// 组队
	MAIL = 2,		// 邮件
	QUJING_AWARD = 3,	//取经奖励
	QUJING_ROBBED = 4,	//取经被抢	
}

class PlayFunTipBtn extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // MainFunTimeBtnSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected iconDisplay: eui.Image;
    protected redPoint: eui.Image;
    protected time: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public static ICON = {
		[PlayFunTipBtnType.CATCH_PET]: "ui_bm_zhuabu",
		[PlayFunTipBtnType.TEAM]: "ui_zjm_bt_zudui",
		[PlayFunTipBtnType.MAIL]: "ui_bm_youjian",
		[PlayFunTipBtnType.QUJING_AWARD]: "ui_bm_husongjiangli",
		[PlayFunTipBtnType.QUJING_ROBBED]: "ui_bm_beijie",
	}

	protected childrenCreated() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _OnClick() {
		let data: PlayFunTipBtnData = this.data

		if (data.id == PlayFunTipBtnType.CATCH_PET) {
			let view = ViewManager.ins().getView(PlayFunView) as PlayFunView
			view.CatchPetClick()
		} else if (data.id == PlayFunTipBtnType.TEAM) {
			TeamBaseModelMsg.GoHasTeamPanel()
		} else if (data.id == PlayFunTipBtnType.MAIL) {
			ViewManager.ins().open(MailWin)
		} else if (data.id == PlayFunTipBtnType.QUJING_AWARD) {
			ViewManager.ins().open(QujingMainWin)
		} else if (data.id == PlayFunTipBtnType.QUJING_ROBBED) {
			ViewManager.ins().open(QujingRecordWin)
		}
	}

	public DoUpdate() {
		let data: PlayFunTipBtnData = this.data
		return false
	}

	public dataChanged() {
		let data: PlayFunTipBtnData = this.data
		this.iconDisplay.source = PlayFunTipBtn.ICON[data.id]
	}
}

class PlayFunTipBtnData {
	id: number
	hasTime?: boolean
}
