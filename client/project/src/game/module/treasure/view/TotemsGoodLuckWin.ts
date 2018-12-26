
/**
 * 神装寻宝
 */
class TotemsGoodLuckWin extends  BaseView implements ICommonWindowTitle 
{

	public static NAME = "神装寻宝"

    /////////////////////////////////////////////////////////////////////////////
    // TotemsGoodLuckSkin.exml
    /////////////////////////////////////////////////////////////////////////////

	public static LAYER_LEVEL = LayerManager.UI_Main

    protected btn1: eui.Button;
    protected btn2: eui.Button;
    protected btn0: eui.Button;
    protected priceIcon1: PriceIcon;
    protected priceIcon0: PriceIcon;
    protected priceIcon2: PriceIcon;
    protected rewardIcon1: PriceIcon;
    protected rewardIcon0: PriceIcon;
    protected rewardIcon2: PriceIcon;
    protected group: eui.Group;
    protected list: eui.List;
    protected getway: GetwayLabel;
    // protected fristGet: eui.Group;
    // protected fristGetItem: ItemBaseNotName;
    //protected luckLabel: eui.Label;
    protected selectImg: eui.Image;
    //protected luckbar: eui.ProgressBar;
    /////////////////////////////////////////////////////////////////////////////

	private mRetData: Sproto.sc_luck_ret_request

	public constructor() {
		super()
		this.skinName ="TotemsGoodLuckSkin"
		this.list.itemRenderer = TreasureLabelItem

		this._AddClick(this.btn0, this._OnClick)
		this._AddClick(this.btn1, this._OnClick)
		this._AddClick(this.btn2, this._OnClick)
		this._AddClick(this.getway, this._OnClick)
	}

	childrenCreated() {
		let config = GameGlobal.Config.EquipLotteryConfig //EquipLotteryBaseConfig
		let configData1 = config[1][0]
		this.priceIcon0.type = configData1.cost.id
		this.priceIcon0.price = configData1.cost.count
		this.rewardIcon0.type = configData1.rewards[0].id
		this.rewardIcon0.price = configData1.rewards[0].count

		let configData2 = config[2][0]
		this.priceIcon1.type = configData2.cost.id
		this.priceIcon1.price = configData2.cost.count
		this.rewardIcon1.type = configData2.rewards[0].id
		this.rewardIcon1.price = configData2.rewards[0].count

		let configData3 = config[3][0]
		this.priceIcon2.type = configData3.cost.id
		this.priceIcon2.price = configData3.cost.count
		this.rewardIcon2.type = configData3.rewards[0].id
		this.rewardIcon2.price = configData3.rewards[0].count

		let items = this.GetShowItmes()
		for (let i = 0; i < this.group.numChildren; i++) {
			let item = this.group.getChildAt(i) as ItemBaseNotName
			let itemData = items[i]
			if (!itemData) {
				continue
			}
			item.data = itemData

			//Add Eff
			let effArr=GameGlobal.Config.EquipLotteryBaseConfig.effitem;
			for(let x=0;x<effArr.length;x++)
			{
				if(effArr[x]==itemData.id)
					this.addTypeEff(item,itemData);
			}
		}

		//this.luckLabel.textFlow = TextFlowMaker.generateTextFlow(this.GetShowText())
		// this.luckbar.maximum = GameGlobal.Config.EquipLotteryBaseConfig.luckpro
		// this.luckbar.value = 0
	}

	public UpdateContent() 
	{

	}

	private GetShowItmes() {
		return GameGlobal.Config.EquipLotteryBaseConfig.showitem1 || []
	}

	private GetShowText() {
		return GameGlobal.Config.EquipLotteryBaseConfig.lucktext1 || ""
	}

	// private UpdateLuckBar() {
	// 	this.luckbar.value = GameGlobal.TreasureHuntModel.GetLuck()
	// }

	public OnOpen() {
		this.observe(MessageDef.LUCK_RET_ANIM, this._StartAnim)
		this.observe(MessageDef.LUCK_RECORD, this._UpdateInfo)
		// this.observe(MessageDef.LUCK_RET_SUC, this._UpdateRetData)
		// this._UpdateRetData()
		this._UpdateInfo()

		this.timeDoEff();

		GameGlobal.TreasureHuntModel.SendGetInfo()
		// this.fristGetItem.data = GameGlobal.Config.EquipLotteryBaseConfig.firstitme
	}

	public OnClose() {
		if (this.mRetData) {
			ViewManager.ins().open(TreasureResultPanel, this.mRetData)
			this.mRetData = null
		}
	}

	private _UpdateInfo() {
		//this.UpdateLuckBar()
		let info = GameGlobal.TreasureHuntModel.mInfo
		if (!info) {
			return
		}
		if (!info.equiprecords) {
			return
		}
		this.list.dataProvider = new eui.ArrayCollection(info.equiprecords)
	}

	// private _UpdateRetData() {
	// 	let info = GameGlobal.TreasureHuntModel.mInfo
	// 	// this.fristGet.visible = info && (info.counts[2] || 0) < 1
	// }

	private _StartAnim(data: Sproto.sc_luck_ret_request) {
		this.mRetData = data
		this.selectImg.visible = true
		this.m_PosIndex = 0
		this.GetPos(0)
		TimerManager.ins().doTimer(80, MathUtils.limitInteger(8, 18), this._UpdateAnimPos, this, () => {
			if (this.mRetData) {
				ViewManager.ins().open(TreasureResultPanel, this.mRetData)
				this.mRetData = null
				this.selectImg.visible = false
			}
		})
	}

	private GetPos(index: number) {
		let child = this.group.getChildAt(index) as any
		if (child) {
			let point = egret.$TempPoint
			child.localToGlobal(child.itemIcon.x, child.itemIcon.y, point)
			this.globalToLocal(point.x, point.y, point)	
			this.selectImg.x = point.x - 10
			this.selectImg.y = point.y - 10
			let scale = index == 0 || index == 6 || index == 3 || index == 9 ? 1 : 0.85
			this.selectImg.scaleX = this.selectImg.scaleY = scale
		}
		return null
	}

	private m_PosIndex = 0

	private _UpdateAnimPos() {
		this.GetPos(++this.m_PosIndex % this.group.numChildren)
	}

	private addEff(item,string,count):MovieClip
	{
		let eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2(string), true, count); //"ui_eff_q003"
        eff.x =55;
        eff.y =53;
		eff.scaleX=1.1
		eff.scaleY=1.1
        item.addChild(eff);
		return eff;
	}


private effDic={};
	private addTypeEff(item,itemData)
	{
		let itemConfig = GlobalConfig.ins().ItemConfig[itemData.id];
		let type =itemConfig.quality;
		if(type==4)
		{
			this.addEff(item,"ui_eff_q002",0);
			this.addEff(item,"ui_eff_q003",1);;
			this.effDic[type]=item;
		}
		else if(type==5)
		{
			this.addEff(item,"ui_eff_q001",0);
			this.addEff(item,"ui_eff_q003",1);
			this.effDic[type]=item;
		}

	}
	private timeDoEff()
	{
		TimerManager.ins().doTimer(3000,0,()=>{
			for(let key in this.effDic)
			{
				if(key=="4")
				{
					this.addEff(this.effDic[key],"ui_eff_q003",1);
				}
				if(key=="5")
				{
					this.addEff(this.effDic[key],"ui_eff_q003",1);
				}
			}
		},this);
	}

	private _OnClick(e: egret.TouchEvent) {

		switch (e.currentTarget) {
			case this.btn0:
				this.BuyHunt(1)
			break
			case this.btn1:
				this.BuyHunt(2)
			break
			case this.btn2:
				this.BuyHunt(3)
			break
			case this.getway:
				let datas = GameGlobal.Config.EquipLotteryBaseConfig.text
				let desc = []
				for (let data of datas) {
					let item = GameGlobal.Config.ItemConfig[data.id]
					if (!item) {
						continue
					}
					desc.push(StringUtils.repeatStr("   ", 5) + this.complementByChar(item.name, 12) + data.rate + "%")
				}
				ActivityDescPanel.Show(desc.join("\n"), "奖励说明")
			break
		}
	}

	public complementByChar(str: string, length: number) {
        str = str + ""
        var byteLen = str.length
        return str + StringUtils.repeatStr("   ", length - byteLen);
    }

	private BuyHunt(type: number) {
		if (this.mRetData) {
			return
		}
		let config = GameGlobal.Config.EquipLotteryConfig[type][0]
		if (Checker.Money(config.cost.id, config.cost.count)) {
			GameGlobal.TreasureHuntModel.SendTreasure(2, type)
		}
	}
}