/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/17 11:51
 * @meaning: 副本藏宝图详情
 * 
 **/


class FbCbtPanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "藏宝图"

    /////////////////////////////////////////////////////////////////////////////
    // CangbaotuSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected pPop1: eui.Component;
    protected pPop2: eui.Component;
    protected pPop3: eui.Component;
    protected pPop4: eui.Component;
    protected pPop5: eui.Component;
    protected pPop6: eui.Component;
    protected lbTitle: eui.Label;
    protected lbLv: eui.Label;
    protected prevBtn: eui.Button;
    protected nextBtn: eui.Button;
    protected btnHard: eui.Button;
    protected pReward1: eui.Component;
    protected pReward2: eui.Component;
    protected lbVip: eui.Label;
    protected lbCondi: eui.Label;
    protected lbLock: eui.Label;
    protected checkBox: eui.CheckBox;
    protected oneKeyBtn: eui.Button;
    protected challageBtn: eui.Button;
    protected bar1: eui.ProgressBar;
    protected bar2: eui.ProgressBar;
    protected bar3: eui.ProgressBar;
    protected itemGroup: eui.Group;
    protected pItem1: eui.Component;
    protected pItem2: eui.Component;
    protected pItem3: eui.Component;
    protected pGroupRewar: eui.Group;
    protected itemBaee: ItemBase;
    protected lbPassLvReward: eui.Label;
    /////////////////////////////////////////////////////////////////////////////


	// 引导对象
	public GetGuideTarget() {
		return {
			[1]: this.challageBtn
		}
	}

	//奖励内容
	tSpReward = [];

	private tGem: CangbaotuPop[] = []//宝箱列表

	private tReward: CangbaotuReward[] = []//宝箱列表
	private tItem: CangbaotuItem[] = []//宝箱列表


	tCbtData: FbcbtData[][] = [];//藏宝图数据

	tStarRewardData = [];//星级奖励数据

	nNewLvNum = 1;



	nIndex = 1//当前页

	nSelect = 0; //当前选择关卡

	nMaxStar = 1; //当前页最大星数

	tStarList = [];//星星列表


	nNowStar = 0;//当前页星星数量

	nDownTime = 10;//倒计时发送

	nReward = 1;//当前点击的宝箱

	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "CangbaotuSkin"
		this.bar1.labelDisplay.visible = false
		this.bar2.labelDisplay.visible = false
		this.bar3.labelDisplay.visible = false
		this.bar1.slideDuration = 0
		this.bar2.slideDuration = 0
		this.bar3.slideDuration = 0
	}

	public childrenCreated() {
		for (let i = 1; i <= 6; i++) {
			let item = this["pPop" + i]
			this.tGem[i] = item
			this._AddClick(item, this.onClickGem)
		}


		for (let i = 0; i <= 1; i++) {
			let item = this["pReward" + (i + 1)]
			this.tReward[i] = item
			this.tReward[i].listView.itemRenderer = ItemBase
			this._AddClick(item, this.onClick)
		}

		for (let i = 0; i <= 2; i++) {
			let item = this["pItem" + (i + 1)]
			this.tItem[i] = item
			this._AddClick(item, this.onClickItem)
		}

	}

	public OnOpen() {


		this.observe(MessageDef.FB_CBT_UPDATE, this.updateServer)//藏宝图变化更新
		this.observe(MessageDef.FB_CBT_UPDATE_REWARD, this.UpdateContent)//藏宝图奖励变化更新


		this._AddClick(this.oneKeyBtn, this.onClick)
		this._AddClick(this.challageBtn, this.onClick)

		this._AddClick(this.prevBtn, this.onClick)
		this._AddClick(this.nextBtn, this.onClick)

		this._AddClick(this.btnHard, this.onClick)

		UIHelper.ShowRedPoint(this.challageBtn, true) //红点常驻

		this.checkBox.addEventListener(egret.Event.CHANGE, this.chage, this)


		this.initStarData()//初始化星级数据

		//初始化选择自动挖宝 
		this.checkBox.selected = GameGlobal.UserFb.bCbtAutoFight
		this.nDownTime = 10

		this.checkBox.labelDisplay.text = "自动挖宝"

		this.AddTimer(1000, 0, this.startUpdateTime); //时间更新函数

		this.updateServer()

		// this.btnHard.visible = GameGlobal.UserFb.CanHardCbt()
	}

	//点击选择框改变内容
	public chage() {
		// this.startUpdateTime()
		// if()
		this.nDownTime = 10

		if (!this.checkBox.selected) {
			this.checkBox.labelDisplay.text = "自动挖宝"
		}

		GameGlobal.UserFb.bCbtAutoFight = this.checkBox.selected
	}

	//更新选择框内容
	public upDataSelectRect() {
		var str = "自动挖宝"
		if (this.nDownTime >= 10 || this.nDownTime < 0) {
			str = "自动挖宝"
		}
		else {
			str = this.nDownTime + "S后自动挖宝"
		}
		this.checkBox.labelDisplay.text = str
	}

	public startUpdateTime() {
		if (this.checkBox.selected) {
			// 
			if (this.nDownTime > 0) {
				this.nDownTime = this.nDownTime - 1
			}
			else if (this.nDownTime === 0) {
				//挑战
				var pData = this.getNowLvData()
				GameGlobal.UserFb.sendfbJoin(2, pData.id)
				this.nDownTime = this.nDownTime - 1
			}
			else {

			}
			this.upDataSelectRect()
		}


	}


	public updateServer() {
		this.setData()
		this.locateNewLevel()
		this.UpdateContent()
	}


	public initStarData() {
		this.tStarRewardData = GameGlobal.Config.TreasureMapStarConfig
	}


	//定位到最新的宝藏
	public locateNewLevel(bUpIndex = true) {
		// this.tCbtData
		for (const item in this.tCbtData) {
			var pLvData = this.tCbtData[item]
			for (const index in pLvData) {
				// if(pLvData[index].star===0) //定位到最新一关
				if (pLvData[index].todayNum === 0)//定位到当天最新一关 //策划需要改 by 6.26
				{
					if (bUpIndex) {
						this.nIndex = parseInt(item) + 1
					}
					this.nSelect = parseInt(index)
					return
				}
			}
		}



	}

	private GetArrowRedPoint(index: number, star: number = null) {
		let reward = GameGlobal.UserFb.getCbtStarRewardPage(index)
		if (reward >= 14) {
			return false
		}
		if (star == null) {
			star = 0
			for (let data of this.tCbtData[index - 1]) {
				star = star + data.star
			}
		}
		for (let i = 0; i < 3; i++) {
			if (!BitUtil.Has(reward, i + 1)) {
				var pData = this.tStarRewardData[this.nIndex][i]
				if (star >= pData.star) {
					return true
				}
			}
		}
		return false
	}

	//左边箭头显示
	public showLeftArrow() {
		if (this.prevBtn.visible = this.tStarRewardData[this.nIndex - 1]) {
			let red = false
			for (let i = this.nIndex - 1; i >= 1; --i) {
				if (this.GetArrowRedPoint(i)) {
					red = true
					break
				}
			}

			UIHelper.ShowRedPoint(this.prevBtn, red)

		}
	}

	public showRightArrow() {
		var tPageData = this.tCbtData[this.nIndex - 1]
		var nStar = 0
		for (const item in tPageData) {
			nStar = nStar + tPageData[item].star
		}
		// 当前有星级，下一章有数据
		if (nStar > 0 && this.tCbtData[this.nIndex]) {
			this.nextBtn.visible = true

			let red = false
			for (let i = this.nIndex + 1; i <= 99; ++i) {
				let pageData = this.tCbtData[i - 1]
				if (!pageData) {
					break
				}
				let star = 0
				for (const item in pageData) {
					star = star + pageData[item].star
				}
				if (!star) {
					break
				}
				if (this.GetArrowRedPoint(i, star)) {
					red = true
					break
				}
			}

			UIHelper.ShowRedPoint(this.nextBtn, red)

		}
		else {
			this.nextBtn.visible = false
		}
	}


	public setData() {




		this.tCbtData = []
		this.tSpReward = [];
		

		var config = GameGlobal.UserFb.getCbtPageData()//获取藏宝图数据
		for (const item in config) {
			this.tCbtData.push(config[item])
		}

		let locong = GameGlobal.Config.TreasureMapConfig
		for (const item in locong) {
			//奖励内容
			if (locong[item].item) {
				let obj = { lv: locong[item].id, item: locong[item].item, caption: locong[item].caption}
				this.tSpReward.push(obj)
			}
		}


		this.nNowStar = 0;//重置星数
		var pPage = this.tCbtData[this.nIndex - 1]
		for (const item in pPage) {
			this.nNowStar = this.nNowStar + pPage[item].star//计算现在拥有星数
		}

		//最新一关id 
		this.nNewLvNum = this.getLastNum()
		


		this.tStarList = []//重置一下星星类型
	}

	private getLastNum() {
		//最新一关id 
		for (const item in this.tCbtData) {
			var pLvData = this.tCbtData[item]
			for (const index in pLvData) {
				if(pLvData[index].star===0) //定位到最新一关
				{
					return pLvData[index].id
				}
			}
		}
		return 1
	}

	public static GetLastNum() {
		let tCbtData = []
		var config = GameGlobal.UserFb.getCbtPageData()//获取藏宝图数据
		for (const item in config) {
			tCbtData.push(config[item])
		}

		for (const item in tCbtData) {
			var pLvData = tCbtData[item]
			for (const index in pLvData) {
				if(pLvData[index].star===0) //定位到最新一关
				{
					return pLvData[index].id
				}
			}
		}
		return 1
	}


	private onClick(e: egret.TouchEvent) {
		var pData = this.getNowLvData()
		switch (e.target) {
			case this.oneKeyBtn:
				//需要判断vip
				if (GameGlobal.UserFb.getCbtCanSwap()) {
					GameGlobal.UserFb.sendfbSweep(1)
				}
				else {
					UserTips.ins().showTips("无法扫荡")
				}
				break
			case this.challageBtn:
				if (UserFb.FinishAndCheckFighting2()) {
					GameGlobal.UserFb.bCbtAcross = pData.star
					GameGlobal.UserFb.bCbtAutoFight = true
					GameGlobal.UserFb.sendfbJoin(2, pData.id)
				}
				break
			case this.prevBtn:
				if (this.nIndex >= 1) {
					this.nIndex = this.nIndex - 1
					this.UpdateContent()
					this.locateNewLevel(false)
				}
				break
			case this.nextBtn:
				if (this.nIndex < this.tCbtData.length) {
					this.nIndex = this.nIndex + 1
					this.UpdateContent()
					this.locateNewLevel(false)
				}

				break
			case this.btnHard:

				break

		}
	}

	public onClickItem(e: egret.TouchEvent) {
		var pData;
		switch (e.currentTarget) {
			case this.pItem1:
				pData = this.tStarRewardData[this.nIndex][0];
				this.nReward = 1;
				break;
			case this.pItem2:
				pData = this.tStarRewardData[this.nIndex][1];
				this.nReward = 2;
				break;
			case this.pItem3:
				pData = this.tStarRewardData[this.nIndex][2];
				this.nReward = 3;
				break;
		}

		var strIndex = "第" + this.nIndex + "关"
		var strLv = pData.star + "星"

		var bGet = GameGlobal.UserFb.getCbtStarReward(this.nIndex, this.nReward)
		var bHaveGet = false
		if (this.nNowStar >= pData.star && (!bGet)) {
			bHaveGet = true
		}

		WarnWin.showReward(`|C:0x6E330B&T: 通关藏宝图第|C:0x4fcd4c&T:${strIndex}|C:0x6E330B&T:获得|C:0x4fcd4c&T:${strLv}|C:0x6E330B&T:奖励|`,
			this.getRewrd, this, null, null, "reward", { title: '通关奖励', reward: pData.starAward, btnName: "领取奖励", bHideSureBtn: !bHaveGet });

	}

	//领取宝箱奖励
	getRewrd() {
		GameGlobal.UserFb.getCbtReward(this.nIndex, this.nReward)
	}


	private onClickGem(e: egret.TouchEvent) {
		let index = this.tGem.indexOf(e.currentTarget)
		this.nSelect = index - 1
		this.UpdateContent()
	}



	UpdateContent() {
		this.setData()

		//宝藏信息
		var nGenIndex = 0
		for (const item in this.tGem) {
			var pGem = this.tGem[item]
			this.upDataGem(pGem, nGenIndex)
			nGenIndex = nGenIndex + 1
		}

		//奖励信息
		for (const item in this.tReward) {
			this.upDateReward(this.tReward[item], parseInt(item))
		}

		//星数奖励
		for (const item in this.tItem) {
			this.upDateItem(this.tItem[item], parseInt(item))
		}

		this.updateInfo()



	}

	//更新界面信息
	public updateInfo() {
		var pData = this.getNowLvData()
		this.lbTitle.text = "藏宝图" + this.nIndex//页数

		this.lbLv.text = "第" + pData.id + "关" //关卡

		this.bar1.value = 0
		this.bar2.value = 0
		this.bar3.value = 0
		//星数进度条
		if (this.tStarList.length >= 3) {
			if (this.nNowStar <= this.tStarList[0]) {
				this.bar1.value = (this.nNowStar / this.tStarList[0]) * 100
			} else if (this.nNowStar <= this.tStarList[1]) {
				this.bar1.value = 100
				let v = this.nNowStar
				v -= this.tStarList[0]
				this.bar2.value = (v / (this.tStarList[1] - this.tStarList[0])) * 100
			} else {
				this.bar1.value = 100
				this.bar2.value = 100
				let v = this.nNowStar
				v = v - this.tStarList[1]
				this.bar3.value = (v / (this.tStarList[2] - this.tStarList[1])) * 100
			}
		}



		this.lbVip.text = "vip" + GlobalConfig.ins().TreasureMapBaseConfig.viplevel + "开启"

		//困难模式
		// if (pData.dod === 2) {
		// 	this.btnHard.visible = true
		// }
		// else {
		// 	this.btnHard.visible = false
		// }

		//奖励预览
		let pReData;
		for (const item in this.tSpReward) {
			if(this.tSpReward[item].lv>=this.nNewLvNum)
			{
				pReData = this.tSpReward[item]
				break
			}
		}

		if(pReData)
		{
			this.pGroupRewar.visible = true
			this.itemBaee.setItemData(pReData.item)
			this.lbPassLvReward.text = pReData.caption
		}
		else
		{
			this.pGroupRewar.visible = false
		}



		this.showLeftArrow()
		this.showRightArrow()
	}

	//获取当前关卡数据
	public getNowLvData() {
		var pData
		pData = this.tCbtData[this.nIndex - 1][this.nSelect]
		return pData
	}

	//获取当前页奖励数据
	public getNowPageReward() {
		//获取星级相关数据

	}

	//_item 节点 _index 下标
	public upDataGem(_item, _index) {
		var pData = this.tCbtData[this.nIndex - 1][_index]

		this.nSelect === _index ? _item.imgSelect.visible = true : _item.imgSelect.visible = false

		if (pData.star > 0) {
			_item.imgReward.source = "ui_fb_bm_baoxiang03"
		}
		else {
			_item.imgReward.source = "ui_fb_bm_baoxiang02"
		}

		_item.imgGet.visible = pData.todayNum > 0

		switch (pData.star) {
			case 0:
				_item.imgStar1.filters = Color.GetFilter()//变灰
				_item.imgStar2.filters = Color.GetFilter()//变灰
				_item.imgStar3.filters = Color.GetFilter()//变灰
				break;
			case 1:
				_item.imgStar1.filters = null
				_item.imgStar2.filters = Color.GetFilter()//变灰
				_item.imgStar3.filters = Color.GetFilter()//变灰
				break;
			case 2:
				_item.imgStar1.filters = null
				_item.imgStar2.filters = null
				_item.imgStar3.filters = Color.GetFilter()//变灰
				break
			case 3:
				_item.imgStar1.filters = null
				_item.imgStar2.filters = null
				_item.imgStar3.filters = null
				break;
		}


	}

	//_item 节点 _index 下标
	public upDateItem(_item, _index) {
		var pData = this.tStarRewardData[this.nIndex][_index]
		var nStar = pData.star || 1 //设置星数

		_item.lbStar.text = nStar

		//记录星星列表
		this.tStarList.push(nStar)

		if (_index == 2) {
			this.nMaxStar = nStar //记录星数
		}


		//红点
		if (this.nNowStar >= nStar) {
			_item.imgRed.visible = true
		}
		else {
			_item.imgRed.visible = false
		}

		//需要补充已经领取之后的逻辑 (this.nIndex 下标为1开始,_index下标为0开始 )
		var bGet = GameGlobal.UserFb.getCbtStarReward(this.nIndex, _index + 1)
		if (bGet) {
			_item.imgRed.visible = false
			_item.imgGet.visible = true
		}
		else {
			_item.imgGet.visible = false
		}
	}

	//_item 节点 _index 下标
	public upDateReward(_item, _index) {

		var pData = this.getNowLvData()

		var tCtReward = []

		if (_index === 0) {
			//已领取图片
			if (pData.star > 0) {
				_item.imgGet.visible = true
			}
			else {
				_item.imgGet.visible = false
			}

			//首通奖励
			tCtReward = pData.firstAwardSw
		}
		else {
			_item.lbNe.text = "通关奖励"

			//已领取图片
			if (pData.todayNum > 0) {
				_item.imgGet.visible = true
			}
			else {
				_item.imgGet.visible = false
			}

			//通关奖励
			tCtReward = pData.dayAward
		}



		_item.listView.dataProvider = new eui.ArrayCollection(tCtReward);



	}



	private onListViewClick(e: eui.ItemTapEvent) {
		// var pItem = e.item
		// ViewManager.ins().open(BuyWin,pItem)
	}


}

//宝箱
interface CangbaotuPop extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// CangbaotuPopSkin 
	/////////////////////////////////////////////////////////////////////////////
	imgStar1: eui.Image;
	imgStar2: eui.Image;
	imgStar3: eui.Image;

	imgReward: eui.Image; //宝箱

	imgGet: eui.Image;//已获得
	imgSelect: eui.Image;//选择


	/////////////////////////////////////////////////////////////////////////////
}


//奖励
interface CangbaotuReward extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// CangbaotuRewardSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	listView: eui.List;//列表
	lbNe: eui.Label;//名字
	imgGet: eui.Image;



	/////////////////////////////////////////////////////////////////////////////
}


//箱子
interface CangbaotuItem extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// CangbaotuItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////


	lbStar: eui.Label;//星星个数
	imgRed: eui.Image;//红点
	imgGet: eui.Image;


	/////////////////////////////////////////////////////////////////////////////
}





