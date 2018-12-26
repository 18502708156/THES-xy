class YuanfenQixingPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "北斗七星"

    /////////////////////////////////////////////////////////////////////////////
    // YuanfenInfoSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    protected powerLabel: PowerLabel;
    /////////////////////////////////////////////////////////////////////////////

    protected mType

	public constructor() {
		super()
        this.skinName = "YuanfenInfoSkin"
        this.mType = 1
	}

    public childrenCreated() {

        this.list.itemRenderer = YuanfenItem
        
    }

    public UpdateContent() {
        this.powerLabel.text = GameGlobal.YuanfenModel.GetAllPower()
        let dataList = GameGlobal.YuanfenModel.GetDataList(this.mType)
        this.list.dataProvider = new eui.ArrayCollection(dataList)
    }

	public OnOpen() {
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateContent)
	}

	public OnClose() {
        
	}
}

class YuanfenItem extends eui.ItemRenderer {

    /////////////////////////////////////////////////////////////////////////////
    // YuanfenItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list:eui.List;
    protected labName:eui.Label;
    protected labAttr:eui.Label;
    protected labPower:eui.Label;
    protected imgAct:eui.Image;
    protected btnActive:eui.Button;
    /////////////////////////////////////////////////////////////////////////////
    
	public childrenCreated() {
		this.btnActive.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this)
	}

	public dataChanged() {
        let config = this.data
        this.labName.text = config.name
        this.labAttr.textFlow = AttributeData.GetAttrTabString(config.attrs, " ")
        this.labPower.text = `+${ItemConfig.CalcAttrScoreValue(config.attrs)}`
        this.imgAct.visible = GameGlobal.YuanfenModel.HasAct(config.id)
        this.btnActive.visible = !this.imgAct.visible

        this.list.itemRenderer = YuanfenHeadItem
        this.list.dataProvider = new eui.ArrayCollection(config.group)
	}

    private _OnBtnClick() {
        if (!GameGlobal.YuanfenModel.CanYuanfenAct(this.data.id))
        {
            UserTips.ins().showTips("未集齐，不可激活")
            return
        }

        GameGlobal.YuanfenModel.SendActCombo(this.data.id)
    }
}

class YuanfenHeadItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// YuanfenHeadSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected item: ItemIcon;
    protected imgBattle: eui.Image;
    protected imgType: eui.Image;
    protected lbName: eui.Label;
    protected starGroup: eui.DataGroup;
	/////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
        this.item.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this)
	}

	public dataChanged() {
		switch(this.data.type)
        {
            case 1: //宠物
                this.SetPetInfo(this.data.id)
            break
            case 2: //天将
                this.SetTianshenInfo(this.data.id)
            break
            case 3: //仙侣
                this.SetXianlvInfo(this.data.id)
            break
        }
	}

    private _OnBtnClick() {
        ViewManager.ins().open(YuanfenTipWin, this.data)
    }

    private SetPetInfo(id) {
        let config = GameGlobal.Config.petBiographyConfig[id]
        if (!config)
            return

        this.lbName.text = config.name
        this.lbName.textColor = ItemBase.GetColorByQuality(config.quality)
        this.item.SetQuality(config.quality)
		this.item.setItemImg(PetConst.GetHeadIcon(id))
        this.item.setGray(!GameGlobal.PetModel.HasPet(id))
    }

    private SetXianlvInfo(id) {
        let config = GameGlobal.Config.partnerBiographyConfig[id]
        if (!config)
            return

        this.lbName.text = config.name
		this.lbName.textColor = ItemBase.GetColorByQuality(config.quality)
		this.item.SetQuality(config.quality)
		this.item.setItemImg("resource/assets/image/head/xianlv/" + config.icon + ".png")
		this.item.setGray(!GameGlobal.XianlvModel.HasXianlv(id))
    }

    private SetTianshenInfo(id) {
        let config = GameGlobal.Config.AirMarshalListConfig[id]
        if (!config)
            return

        this.lbName.text = config.name
		this.lbName.textColor = ItemBase.GetColorByQuality(config.quality)
		this.item.SetQuality(config.quality)
		this.item.setItemImg("resource/assets/image/head/tianshen/" + config.icon + ".png");
		this.item.setGray(!GameGlobal.TianShenModel.HasTianShen(id))
    }
}
