/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/10 16:21
 * @meaning: 命格手动分解界面
 * 
 **/

class DestinyResolvelHandleLayer extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	/////////////////////////////////////////////////////////////////////////////
	// DestinyResolveHandleDlgSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected listView: eui.List;
	protected btn: eui.Button;
	/////////////////////////////////////////////////////////////////////////////



	tLayerData; //界面数据

	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()

		this.skinName = "DestinyResolveHandleDlgSkin"
		this.listView.itemRenderer = DestinyResolveHandleItem;
		this.commonDialog.dialogReturnBtn.visible = false
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this._AddClick(this.btn, this.onResolve)
		this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent)//物品变化
		this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent)//命格数据变化

		this.UpdateContent()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
	}

	public onResolve() {
		if(this.getResolveData().length)
		GameGlobal.DestinyManage.babyStartSmelt(this.getResolveData())
	}

	private UpdateContent() {
		this.tLayerData = CommonUtils.copyDataHandler(UserBag.ins().GetBagStarBySort())
		this.listView.dataProvider = new eui.ArrayCollection(this.tLayerData)
	}

	public getResolveData() {
		var tList = []
		var tHaveData = this.tLayerData
		for (const item in this.tLayerData) {
			let data = this.tLayerData[item]
			if (data.bSelect) {
				let ob = { id: 0, num: 0 }
				ob.id = data.configID
				ob.num = data.count
				tList.push(ob)
			}
		}
		return tList;
	}


}
