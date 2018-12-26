
class DestinyItem extends eui.Component {

    /////////////////////////////////////////////////////////////////////////////
    // DestinyItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected imgBg: eui.Image;
    protected imgSelect: eui.Image;
    protected imgAdd: eui.Image;
    protected imgIcon: eui.Image;
    protected imgRed: eui.Image;
    protected lbLv: eui.Label;
    protected lbLock: eui.Label;
    /////////////////////////////////////////////////////////////////////////////


	// callBack;//返回函数

	data;//数据

	public constructor() {
		super();
		this.skinName = "DestinyItemSkin";
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
	}



	public onUpdate(_data: { index: boolean, data: any, num: number }){

		this.data = _data
		if(_data.data!=null)
		{
			this.imgAdd.visible = !_data.data
			this.lbLock.text = " "

			let pData = _data.data

			if(pData.level)
			{
				this.lbLv.text = "Lv." + pData.level
				this.imgIcon.visible = true
				let config = GlobalConfig.ins().ItemConfig[pData.item]
				this.imgIcon.source  = ResDataPath.GetItemFullPath(config.icon)
				this.imgBg.source = ResDataPath.GetItemQualityName(config.quality)
			}
			else
			{
				this.imgBg.source = ResDataPath.GetItemQualityName(0)
				this.imgIcon.visible = false
				this.imgAdd.visible = true
				this.lbLv.text = ""
			}

		}
		else
		{
			this.imgAdd.visible = false
			let level = DestinyConst.GetLockLevel(_data.num)
			this.lbLock.text = level + "阶\n解锁"
			this.imgBg.source = ResDataPath.GetItemQualityName(0)
			this.imgIcon.visible = false
			this.lbLv.text = ""
		}

		this.imgSelect.visible = _data.index
		this.imgRed.visible = GameGlobal.DestinyController.mRedPoint.IsRedUp(_data.num)
	}

	// public setHandle(_callBack) {
	// 	if(_callBack)
	// 	{
	// 		this.callBack =_callBack
	// 	}
	// }



	private onClick(e: egret.TouchEvent) {

		 MessageCenter.ins().dispatch(MessageDef.DESTINY_CLICK,this.data.num);

	}



}

