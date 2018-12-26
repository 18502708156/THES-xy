/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 11:01
 * @meaning: 详情
 * 
 **/

class DestinyNiPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "逆命"

    /////////////////////////////////////////////////////////////////////////////
    // DestinyNiSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected gMain: eui.Group;
    protected uiBg1: eui.Image;
    protected lbMore: eui.Label;
    protected listView: eui.List;
    protected lb0: eui.Label;
    protected lb1: eui.Label;
    protected lb2: eui.Label;
    protected lb3: eui.Label;
    protected lb4: eui.Label;
    protected list: eui.List;
    protected gInfoLabel: eui.Label;
    protected btnBuy1: eui.Button;
    protected btnBuy2: eui.Button;
    protected btnBuy0: eui.Button;
    protected imgBg: eui.Image;
    protected imgGet0: eui.Image;
    protected imgBg0: eui.Image;
    protected imgGet1: eui.Image;
    protected imgBg1: eui.Image;
    protected imgGet2: eui.Image;
    protected imgBg2: eui.Image;
    protected imgGet3: eui.Image;
    protected imgBg3: eui.Image;
    protected imgGet4: eui.Image;
    protected priceIcon1: PriceIcon;
    protected priceIcon0: PriceIcon;
	protected effGroup:eui.Group
    /////////////////////////////////////////////////////////////////////////////



	private effect: MovieObject

	tPanelData = [];//界面总体数据数据

	tImgGet: eui.Image[] = []//获得图片

	tRankLabel: eui.Label[] = [];

	nType: number = 0;//界面类型

	nIndex: number;//选择下标

	tDestinyServerInfo: Sproto.sc_baby_star_init_request
	/////////////////////////////////////////////////////////////////////////////

	public mWindowHelpId: number = 37

	public constructor() {
		super()
		this.skinName = "DestinyNiSkin"
		this.listView.itemRenderer = ItemBaseNotName;
		this.list.itemRenderer = ItemBase

		this.gInfoLabel.text = ""

		this.showType()
	}

	public childrenCreated() {
		UIHelper.SetLinkStyleLabel(this.lbMore, "更多奖励") //下划线
		for (let i = 0; i < 5; i++) {
			this.tRankLabel[i] = this["lb" + i]
		}

		for (let i = 0; i < 5; i++) {
			this.tImgGet[i] = this["imgGet" + i]
		}
	}

	public showType()//用于子类继承重写
	{

	}

	public OnOpen(...param: any[]) {

		this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent)//
		this.observe(MessageDef.DESTINY_GET_REWARD, this.upDataReward)//

		this.listView.dataProvider = new eui.ArrayCollection(GlobalConfig.ins().DestinyBaseConfig.rewardView)//更多奖励

		this._AddClick(this.btnBuy0, this.onClick)
		this._AddClick(this.btnBuy1, this.onClick)
		this._AddClick(this.btnBuy2, this.onClick)
		this._AddClick(this.lbMore, this.onClick)
		

		this.initInfo()

	}

	private initInfo() {
	}

	public UpdateContent() {
		this.setData()



		//更新信息
		for (const item in this.tRankLabel) {
			let label = this.tRankLabel[item]
			let tList = this.tDestinyServerInfo.msgData || {}
			let data = tList[item]
			if (tList && data) {
				let config = GameGlobal.Config.ItemConfig[data.id]
				let itemName = config.name || ""
				label.textFlow = TextFlowMaker.generateTextFlow(`|C:0x0054ff&T:${data.name}|获得|C:${Color.GetStr(ItemBase.QUALITY_COLOR[config.quality])}&T:${itemName}|`);
			}
			else {
				label.text = ""
			}
		}

		let tGetImg = ["ui_mg_bm_sanxian_01", "ui_mg_bm_tianxian_01", "ui_mg_bm_jinxian_01", "ui_mg_bm_daluo_01", "ui_mg_bm_huenyuan_01"]
		let tHaveGetImg = ["ui_mg_bm_sanxian", "ui_mg_bm_tianxian", "ui_mg_bm_jinxian", "ui_mg_bm_daluo", "ui_mg_bm_huenyuan"]
		//逆命内容
		for (const item in this.tImgGet) {
			this.tImgGet[item].source = tGetImg[item]
		}

		//当前逆命仙丹
		let nStar = this.tDestinyServerInfo.star || 1
		this.tImgGet[nStar - 1].source = tHaveGetImg[nStar - 1] || ""

		if (nStar == 5) {
			if (!this.effect) {
				this.effect = new MovieClip
			}
			this.effect.LoadByUrl(ResDataPath.GetUIEffePath("eff_ui_zb_003"), -1, true)
			this.effGroup.addChild(this.effect)
		} else {
			if (this.effect) {
				DisplayUtils.removeFromParent(this.effect)
			}
		}

		//金额
		let tPrice0 = GlobalConfig.ins().DestinyBaseConfig.fourpay[0]
		let tPrice1 = GlobalConfig.ins().DestinyDrawConfig[nStar].starCoins
		this.priceIcon0.setConfigData(tPrice0)
		this.priceIcon1.setConfigData(tPrice1)
	}

	public upDataReward(_data: Sproto.cs_baby_start_get_response) {
		//只对逆命奖励界面才更新
		if (_data) {
			this.gInfoLabel.text = "共逆命 " + _data.num + " 次，总共消耗银两 " + _data.cost
			// this.lbGeInfo.text = "共逆命" + _data.num + "次消耗银两" + _data.cost
			let tList = []
			for (const item of _data.data) {
				let data = { type: 1, id: item.id, count: item.count }
				tList.push(data)
			}
			this.list.dataProvider = new eui.ArrayCollection(tList)
			this.list.visible = false
			this._SetTick()
		}
	}

	private _SetTick(): void {
		this.m_StartTime = egret.getTimer()
		TimerManager.ins().remove(this._DoUpdate, this)
		TimerManager.ins().doFrame(1, 0, this._DoUpdate, this)
	}

	private m_StartTime: number
	private static DURATION = 200
	private static DELAY = 50

	private _DoUpdate() {
		this.list.visible = true
		let time = egret.getTimer() - this.m_StartTime
		let delay = DestinyNiPanel.DELAY
		let duration = DestinyNiPanel.DURATION
		for (let i = 0; i < this.list.numChildren; ++i) {
			let child = this.list.getChildAt(i) as eui.ItemRenderer
			let itemIndex = child.itemIndex
			let t = MathUtils.Clamp((time - itemIndex * delay) / duration, 0, 1)
			child.alpha = t
		}
		if (time > this.list.dataProvider.length * delay + duration) {
			TimerManager.ins().remove(this._DoUpdate, this)
		}
	}


	public setData() {
		this.tDestinyServerInfo = GameGlobal.DestinyController.getServerInfo()
	}




	private onClick(e: egret.TouchEvent) {
		let buyNum = 0
		switch (e.target) {
			// case this.btnInfo:
			// 	ViewManager.ins().open(ActivityDescPanel, GlobalConfig.ins().DestinyBaseConfig.rwnotice);
			// 	break
			case this.btnBuy0:
				buyNum = 1
				break
			case this.btnBuy1:
				buyNum = 50
				break
			case this.lbMore:
				ViewManager.ins().open(DestinyShow);
				break
			case this.btnBuy2:
				if (this.tDestinyServerInfo.star >= 5) {
					UserTips.InfoTip("已经点亮混元，请点击逆命按钮")
					return
				}
				let tPrice0 = GlobalConfig.ins().DestinyBaseConfig.fourpay[0]
				if (Checker.Data(tPrice0)) {
					GameGlobal.DestinyManage.babyStartLight()
				}
				break

		}

		let nStar = this.tDestinyServerInfo.star || 1
		let tPrice1 = GlobalConfig.ins().DestinyDrawConfig[nStar].starCoins

		if (buyNum && Checker.Data(tPrice1)) {
			GameGlobal.DestinyManage.babyStartGet(buyNum)
			// let addEff = "eff_ui_niming"

			// if (addEff) {
			// 	if (!this.effect) {
			// 		this.effect = new MovieObject
			// 		this.effect.touchEnabled = false
			// 	}
			// 	this.effect.x = 332
			// 	this.effect.y = 372
			// 	this.effect.LoadByUrl(ResDataPath.GetUIEffePath(addEff), 1, true, () => {
			// 		this.gMain.visible = false
			// 		this.gReward.visible = true
			// 		this.nType = 1
			// 		// this.UpdateContent()
			// 	})
			// 	this.gMain.addChild(this.effect);
			// } else {
			// 	if (this.effect) {
			// 		this.effect.ClearCache()
			// 		DisplayUtils.removeFromParent(this.effect)
			// 	}
			// }

		}

	}


}


