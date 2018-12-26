class YuanfenTipWin extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	/////////////////////////////////////////////////////////////////////////////
	// YuanfenTipSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected labName: eui.Label;
	protected labPower: eui.Label;
	protected labGain1: eui.Label;
	protected labGain2: eui.Label;
	protected compHead: YuanfenHeadIcon;
	/////////////////////////////////////////////////////////////////////////////

	private mConfig

	public constructor() {
		super()
		this.skinName = "YuanfenTipSkin"
		this._AddClick(this, this.CloseSelf)
	}

	public OnOpen(...param: any[]) {
		this._AddClick(this.labGain1, this._OnClicked)

		let config = param[0]
		switch(config.type)
        {
            case 1: //宠物
                this.mConfig = this.SetPetInfo(config.id)
            break
            case 2: //天将
                this.mConfig = this.SetTianshenInfo(config.id)
            break
            case 3: //仙侣
                this.mConfig = this.SetXianlvInfo(config.id)
            break
        }

		if (!this.mConfig)
			return

		let gainConfig = GameGlobal.Config.GainItemConfig[this.mConfig.material.id]
		
		for (let idx=1; idx<3; idx++)
		{
			let info = gainConfig.gainWay[idx-1]
			this[`labGain${idx}`].visible = info != null
			if (info)
			{
				this[`labGain${idx}`].text = info[0]
				UIHelper.SetLinkStyleLabel(this[`labGain${idx}`])
			}
		}
	}

	private _OnClicked(e: egret.TouchEvent) {
		
		switch (e.currentTarget) {
			case this.labGain1:
				this.HandleClick(0)
			break
			case this.labGain2:
				this.HandleClick(1)
			break
		}
	}

	private HandleClick(idx) {
		let gainConfig = GameGlobal.Config.GainItemConfig[this.mConfig.material.id]
		let info = gainConfig.gainWay[idx]
		if (!info)
		{
			return
		}

		ViewManager.ins().Guide(info[1][0], info[1][1])
		ViewManager.ins().close(this)
	}

    private SetPetInfo(id) {
        let config = GameGlobal.Config.petBiographyConfig[id]
        if (!config)
            return

        this.labName.text = config.name
        this.labName.textColor = ItemBase.GetColorByQuality(config.quality)
		YuanfenHeadIcon.setInfo(this.compHead, config.quality, PetConst.GetHeadIcon(id))
		this.labPower.text = `获得可提升战力 ${ItemConfig.CalcAttrScoreValue(config.attrs)}`

		return config
    }

    private SetXianlvInfo(id) {
        let config = GameGlobal.Config.partnerBiographyConfig[id]
        if (!config)
            return

        this.labName.text = config.name
		this.labName.textColor = ItemBase.GetColorByQuality(config.quality)
		YuanfenHeadIcon.setInfo(this.compHead, config.quality, "resource/assets/image/head/xianlv/" + config.icon + ".png")
		this.labPower.text = `获得可提升战力 ${ItemConfig.CalcAttrScoreValue(config.attrs)}`

		return config
    }

    private SetTianshenInfo(id) {
        let config = GameGlobal.Config.AirMarshalListConfig[id]
        if (!config)
            return

        this.labName.text = config.name
		this.labName.textColor = ItemBase.GetColorByQuality(config.quality)
		YuanfenHeadIcon.setInfo(this.compHead, config.quality, "resource/assets/image/head/tianshen/" + config.icon + ".png")
		this.labPower.text = `获得可提升战力 ${ItemConfig.CalcAttrScoreValue(config.attrs)}`

		return config
    }

	public OnClose() {

	}
}

class YuanfenHeadIcon extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
    // WorldMapIconSkin.exml
    /////////////////////////////////////////////////////////////////////////////
	protected item:ItemIcon;
	protected lbName:eui.Label;
	protected starGroup:eui.DataGroup;
    /////////////////////////////////////////////////////////////////////////////

	public static setInfo(comp: YuanfenHeadIcon, quality, icon)
	{
		comp.item.SetQuality(quality)
		comp.item.setItemImg(icon)
	}
}
