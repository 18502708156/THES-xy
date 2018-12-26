class YingYuanAddPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Popup
	protected commonDialog: CommonDialog;
	public list: eui.List
	public constructor() {
		super()
		this.skinName = "YingYuanAddSkin";
		this.list.itemRenderer = YingyuanAddItem
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this)
		this.commonDialog.title = "求婚对象"
		this.updateContent()
	}

	private updateContent() {
		let arr = GameGlobal.FriendModel.FriendData.friendsDate
		let arrData = []
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].friendInfo.offlineTime == 0) {
				arrData.push(arr[i])
			}
		}
		let arrDataNum = []
		for (let n = 0; n < arrData.length; n++) {
			let data = GameGlobal.YingYuanModel.getMarryFriends(arrData[n].friendInfo.dbid)
			if (data && !data.ismarry) {
				arrDataNum.push(arrData[n])
			}
		}
		this.list.dataProvider = new eui.ArrayCollection(arrDataNum)
		for (let m = 0; m < this.list.numChildren; m++) {
			if (m % 2 == 0) {
				this.list.$children[m]["bg"].source = "ui_sbm_005"
			} else {
				this.list.$children[m]["bg"].source = "i_sbm_002"
			}
		}

	}

	private _OnClick(e: egret.TouchEvent) {

	}

	public OnClose() {
		this.commonDialog.OnRemoved()
	}
}