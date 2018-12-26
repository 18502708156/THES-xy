class YuanfenMainWin extends BaseEuiView {
	
	public static NAME = "缘份"
	public static LAYER_LEVEL = LayerManager.UI_Main

    /////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = UIHelper.PANEL
	}

	public childrenCreated() {
		this.mCommonWindowBg.SetTabView([
			TabView.CreateTabViewData(YuanfenQixingPanel),
			TabView.CreateTabViewData(YuanfenTianbingPanel),
			TabView.CreateTabViewData(YuanfenTiangongPanel),
			// TabView.CreateTabViewData(YuanfenXingsuPanel),
		])
	}

	public OnOpen(...args) {
		var index = args[0];
		this.mCommonWindowBg.OnAdded(this, index)

		this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateTabBtnRedPoint)

		this.UpdateTabBtnRedPoint()
	}

	public OnClose() {
		this.mCommonWindowBg.OnRemoved()
	}

	private UpdateTabBtnRedPoint() {
		this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.YuanfenModel.IsRedPointYuanfen(YuanfenModelRedPoint.TYPE_1))
		this.mCommonWindowBg.ShowTalRedPoint(1, GameGlobal.YuanfenModel.IsRedPointYuanfen(YuanfenModelRedPoint.TYPE_2))
		this.mCommonWindowBg.ShowTalRedPoint(2, GameGlobal.YuanfenModel.IsRedPointYuanfen(YuanfenModelRedPoint.TYPE_3))
		// this.mCommonWindowBg.ShowTalRedPoint(3, GameGlobal.YuanfenModel.IsRedPointYuanfen(YuanfenModelRedPoint.TYPE_4))
	}

	public static openCheck(...param: any[]) {
		return true;
	}

	OnOpenIndex(openIndex: number): boolean {
		let openId = -1
		if (openIndex == 1) {
			openId = GameGlobal.Config.FateBaseConfig.openlv2
		}
		else if (openIndex == 2) {
			openId = GameGlobal.Config.FateBaseConfig.openlv3
		}
		else if (openIndex == 3) {
			openId = GameGlobal.Config.FateBaseConfig.openlv4
		}

		return Deblocking.Check(openId)
	}
}