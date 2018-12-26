class PlayerChatpanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup;
	/////////////////////////////////////////////////////////////////////////////
	// PlayerChatSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected chatScroller: eui.Scroller;
	protected chatList: eui.List;
	protected chatUserScroller: eui.Scroller;
	protected chatUserList: eui.List;
	protected input: ChatInputView;
	/////////////////////////////////////////////////////////////////////////////

	protected palyerId: number
	private userChatData: Sproto.chat_data;
	protected session: string;


	public constructor() {
		super()
		this.skinName = "PlayerChatSkin";
		this.input.SetCallback((msg: string) => {
			this.sendChat(msg)
		})
	}

	initUI() {
		super.initUI()
		this.commonWindowBg.SetTitle("私聊")
		// this.touchEnabled = false;
	}

	initData() {
		this.chatList.layout = new ceui.CVerticalLayout
		this.chatList.itemRenderer = DetailsChatItem;
		this.chatUserList.itemRenderer = DetailsUserItem;
		this.chatUserList.dataProvider = GameGlobal.PlayerInfoModel.getchatUserListData();
		this.chatUserList.validateNow();
	}
	public OnOpen(...param: any[]) {
		this.commonWindowBg.OnAdded(this);

		this.observe(MessageDef.PLAYER_PREVITE_CHAT, this.updateContent)
		this.observe(MessageDef.PLAYER_PREVITE_CLOSE, this.updateContent)
		this.observe(MessageDef.SEND_MSG_INFO_SUCCESS, this.textInOn)
		this.observe(MessageDef.PLAYER_PREVITE_CHAT, this.UpdateList)
		this.observe(MessageDef.PLAYER_CHECK_ONLINE, this.UpdateList)

		this.AddClick(this.commonWindowBg.closeBtn, this.onClick)
		this.AddItemClick(this.chatUserList, this.onItemClick);

		this.AddTimer(3000, 0, this.checkOnline);

		this.palyerId = param[0].id;
		GameGlobal.PlayerInfoModel.setUserDate(param[0]);
		this.chatUserList.selectedIndex = 0;
		if (param[0].id != null)
			GameGlobal.PlayerInfoModel.sendInitChat(param[0].id);

		if (param[1]) {
			let chatUsersData = GameGlobal.PlayerInfoModel.getchatUserListData();
			for (let i = 0; i < chatUsersData.length; i++) {
				if (chatUsersData.getItemAt(i).newMsg) {
					this.chatUserList.selectedIndex = i;
					this.palyerId = chatUsersData.getItemAt(i).info.id;
					break
				}
			}
		}

	}
	OnClose() {
		this.chatUserList.dataProvider = null;
		this.checkMsg();
	}

	checkOnline() {
		GameGlobal.PlayerInfoModel.sendonLine();
	}

	onItemClick(e) {
		this.session = this.chatUserList.selectedItem.session;
		this.touchTo();
	}

	checkMsg() {
		let chatUsersData = GameGlobal.PlayerInfoModel.getchatUserListData();
		for (let i = 0; i < chatUsersData.length; i++) {
			if (chatUsersData.getItemAt(i).newMsg) {
				break
			}
			if (chatUsersData.length - 1 == i)
				GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, false, true);
		}
		if (chatUsersData.length == 0)
			GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_NEWMSG_SHOW_RED_POINT, false, false);
	}

	onClick() {
		let chatUsersData = GameGlobal.PlayerInfoModel.getchatUserListData();
		chatUsersData.removeAll();
		let chatDatas = GameGlobal.PlayerInfoModel.getChatListData()
		chatDatas = {};
		GameGlobal.PlayerInfoModel.setUserDate(new Sproto.chat_data);
		this.checkMsg();
	}

	touchTo() {
		if (this.session) {
			this.session = this.session;
			let n = this.session.indexOf(":")
			let id1 = this.session.slice(0, n)
			let id2 = this.session.slice(n + 1, this.session.length);
			if (parseInt(id1) == GameGlobal.GameLogic.actorModel.actorID)
				this.palyerId = parseInt(id2);
			else
				this.palyerId = parseInt(id1);
		}
		else
			this.palyerId = null;
		this.chatUserList.validateNow();
		if (this.chatUserList.selectedItem)
			this.chatList.dataProvider = GameGlobal.PlayerInfoModel.getChatListData()[this.chatUserList.selectedItem.session];
		else
			this.chatList.dataProvider = new eui.ArrayCollection([]);
		this.chatList.validateNow();
		// if (this.chatList.contentHeight >= this.chatScroller.height)
		// 	this.chatScroller.viewport.scrollV = this.chatScroller.viewport.contentHeight - this.chatScroller.height
	}

	private updateContent(req) {
		let chatUsersData = GameGlobal.PlayerInfoModel.getchatUserListData();
		let chatDatas = GameGlobal.PlayerInfoModel.getChatListData()
		if (chatUsersData.length == 0)
			ViewManager.ins().close(PlayerChatpanel);

		this.chatUserList.dataProvider = chatUsersData;
		if (this.chatUserList.selectedIndex == -1)
			this.chatUserList.selectedIndex = 0;
		// for (let i = 0; i < chatUsersData.length; i++) {
		// 	if (chatUsersData.getItemAt(i).session == req.session) {
		// 		this.chatUserList.selectedIndex = i;
		// 	}
		// }
		this.session = req.session;
		this.touchTo();
	}

	sendChat(msg: string) {
		if (msg == "") {
			UserTips.ins().showTips("内容不可为空")
		}
		else {
			let role = SubRoles.ins().GetRoleData()
			let selfChatData = new Sproto.chat_data;
			this.touchTo();
			if (this.palyerId != null)
				GameGlobal.PlayerInfoModel.sendChat(this.palyerId, msg);
			else
				UserTips.ins().showTips("没有私聊对象");
		}
	}
	textInOn() {
		this.input.SetText("")
	}

	private UpdateList() {
		UIHelper.ListRefresh(this.chatUserList)
	}
}
class DetailsChatItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// DetailsChatSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected playerAvatar: ItemIcon;
	protected roleNameTxt: eui.Label;
	protected contentImg: eui.Image;
	protected contentTxt: ChatLabel;
	protected contentGroup: eui.Group
	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.skinName = "DetailsChatSkin"
	}

	public childrenCreated() {
		super.childrenCreated()
	}

	public dataChanged() {
		if (this.data.id == GameGlobal.GameLogic.actorModel.actorID)
			this.currentState = "self"
		else
			this.currentState = "other"
		super.dataChanged()
		this.contentTxt.text = this.data.str;
		this.roleNameTxt.text = this.data.name;
		this.playerAvatar.setItemImg(ResDataPath.GetHeadImgName(this.data.job, this.data.sex));
	}
}

class DetailsUserItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// ChatUeseItem.exml
	/////////////////////////////////////////////////////////////////////////////
	protected playerAvatar: ItemIcon;
	protected nameTxt: eui.Label;
	protected onLineTxt: eui.Label;
	protected redPointImg: eui.Image;
	protected closeBtn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super();
		this.skinName = "ChatUeseItem"
	}

	public childrenCreated() {
		super.childrenCreated()
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this)
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this)
	}

	public dataChanged() {
		super.dataChanged()
		this.nameTxt.text = this.data.info.name;
		this.playerAvatar.setItemImg(ResDataPath.GetHeadImgName(this.data.info.job, this.data.info.sex));
		if (this.selected)
			this.data.newMsg = false;
		this.redPointImg.visible = this.data.newMsg;
		this.setOnLine();
	}

	private setOnLine() {
		let req;
		if (GameGlobal.PlayerInfoModel.detailsData.onlineReq)
			req = GameGlobal.PlayerInfoModel.detailsData.onlineReq
		else
			return;
		if (req.onlineStatus[this.itemIndex]) {
			this.onLineTxt.textColor = 0x019704;
			this.onLineTxt.text = "在线";
		}
		else {
			this.onLineTxt.textColor = 0x7C7C7C;
			this.onLineTxt.text = "离线";
		}
	}

	private onTouch() {
		this.redPointImg.visible = false;
		this.data.newMsg = false;
	}
	private close() {
		let user = GameGlobal.PlayerInfoModel.getchatUserListData();
		for (let i = 0; i < user.length; i++) {
			if (user.getItemAt(i).session == this.data.session) {
				user.removeItemAt(i)
				delete GameGlobal.PlayerInfoModel.getChatListData()[this.data.session];
			}
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.PLAYER_PREVITE_CLOSE, new Sproto.sc_chat_private_init_msg_request, DetailsType.normal);
	}
}