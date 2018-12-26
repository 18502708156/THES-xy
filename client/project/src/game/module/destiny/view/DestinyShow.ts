/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/10 16:21
 * @meaning: 命格展示界面
 * 
 **/

class DestinyShow extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// DestinyShowSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected listView: eui.List;
	/////////////////////////////////////////////////////////////////////////////




	tLayerData; //界面数据



	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()

		this.skinName = "DestinyShowSkin"
		this.listView.itemRenderer = DestinyShowRectItem;
		this.commonDialog.dialogReturnBtn.visible = false
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent)//命格数据变化
		this.AddItemClick(this.listView, this.onList)
		this.UpdateContent()
	}

	public OnClose() {
		this.commonDialog.OnRemoved()
		this.removeObserve();
	}

	public onList(e: eui.ItemTapEvent) {
		let config = e.item.bSelect;
		if(e.item.bSelect)
		{
			e.item.bSelect =false
		}
		else
		{
			e.item.bSelect =true
		}
		(this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tLayerData);
		this.listView.validateNow()
	}



	private UpdateContent() {
		let tData = GameGlobal.DestinyController.getShowDestinyData()
		this.tLayerData = []
		for (const item in tData) {
			let bObj = {bSelect:false,tList:[]}
			bObj.tList = tData[item]
			this.tLayerData.push(bObj)
		}
		this.listView.dataProvider = new eui.ArrayCollection(this.tLayerData)
	}



}
