class FriendMainPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

	/////////////////////////////////////////////////////////////////////////////
	// PetMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected btnShop: eui.Button;
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "FriendMainSkin";
	}

	public childrenCreated() {
		this.commonWindowBg.SetTabView([
			TabView.CreateTabViewData(FriendsPanel, { skinName: "MyFriendSkin", mContext: this }),
			TabView.CreateTabViewData(FansPanel, { skinName: "FansSkin", mContext: this }),
			TabView.CreateTabViewData(BlacklistPanel, { skinName: "FriendBlacklistSkin", mContext: this }),
			TabView.CreateTabViewData(ReferrerPanel, { skinName: "ReferrerSkin", mContext: this }),
		]);
	}

	public OnOpen(...args: any[]) {
		this.AddClick(this.btnShop, this.tap)
		if (!args[0]) {
			if (GameGlobal.FriendModel.friendsNum > 0)//没好友打开推荐列表
				this.commonWindowBg.OnAdded(this, 0)
			else
				this.commonWindowBg.OnAdded(this, 3)
		}
		else
			this.commonWindowBg.OnAdded(this, args[0])
		this.observe(MessageDef.FRIEND_RED_POINT_CHANGE, this.showRedPoint)
		this.showRedPoint()
	}

	public OnClose() {
	}

	private tap() {
		ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_YOUQING])
	}

	public showRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.FriendModel.checkRedPoint())
	}

}