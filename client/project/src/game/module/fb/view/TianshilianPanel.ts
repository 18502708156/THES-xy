
class TianshilianPanel extends BaseEuiView implements ICommonWindow, ICommonWindowTitle {


	public static readonly NAME = "勇闯天庭"


	/////////////////////////////////////////////////////////////////////////////
	// TianshilianSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected layerGroup: eui.Group;
	protected bar: eui.ProgressBar;
	protected itemGroup: eui.Group;
	protected maxLabel: eui.Label;
	protected lbReName: eui.Label;
	protected checkBox: eui.CheckBox;
	protected oneKeyBtn: eui.Button;
	protected challageBtn: eui.Button;
	protected prevBtn: eui.Button;
	protected nextBtn: eui.Button;
	public item0: FBRankCom;

	protected showReward:PetShowPanel;


	protected pItemReward1: eui.Component;
	protected pItemReward2: eui.Component;
	protected pItemReward3: eui.Component;
	protected pLayout1: eui.Component;
	protected pLayout2: eui.Component;
	protected pLayout3: eui.Component;


	protected lbPassLvReward: eui.Label;
	protected pItemShowReward: ItemBase;

	protected pGroupRewar: eui.Group;//奖励内容



	/////////////////////////////////////////////////////////////////////////////

	tViewData = [];//天庭部分数据

	tReward = [];//奖励列表
	tServer;//服务端数据
	tNowLyData = [];//当前层级数据

	tSpReward = [];//特别奖励内容
	nSpLv = -1; //特别奖励层数


	tRewardItem = [];//奖励item列表
	tLayoutItem = [];//关卡item

	tBoxObj = [];//宝箱奖励列表

	nRewardPage = 0;//奖励列表页数

	DOWNTIME = GameGlobal.Config.HeavenFbBaseConfig.time;

	nDownTime = 10;//倒计时发送

	nReward = 1;//当前点击的宝箱


	public constructor() {
		super()
		this.skinName = "TianshilianSkin"
		this._AddClick(this.oneKeyBtn, this._OnClick)
		this._AddClick(this.challageBtn, this._OnClick)
		this._AddClick(this.prevBtn, this._OnClick)
		this._AddClick(this.nextBtn, this._OnClick)

		this.showReward.scaleX = 0.7
		this.showReward.scaleY = 0.7

	}


	public childrenCreated() {

		for (let i = 0; i <= 2; i++) {
			let item = this["pItemReward" + (i + 1)]
			this.tRewardItem[i] = item
			this._AddClick(item, this.onClickRw)
		}


		for (let i = 0; i <= 2; i++) {
			let item = this["pLayout" + (i + 1)]
			this.tLayoutItem[i] = item
			this._AddClick(item, this.onClickLy)
		}

	}



	public OnOpen() {
		GameGlobal.UserFb.rankType = RankingModel.RANK_TYPE_TT;
		GameGlobal.RankingModel.sendRank(RankingModel.RANK_TYPE_TT);
		this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, () => {
			this.item0.onUpdate();
		})

		this.observe(MessageDef.FB_TIANTING_UPDATE, this.UpdateContent)//天庭试炼数据变化更新


		this.checkBox.addEventListener(egret.Event.CHANGE, this.chage, this)

		this.AddTimer(1000, 0, this.startUpdateTime); //时间更新函数

		//初始化选择自动挖宝 
		this.checkBox.selected = GameGlobal.UserFb.bTianTingAutoFight
		this.nDownTime = this.DOWNTIME;
		this.checkBox.labelDisplay.text = "自动挑战关卡"
		this.item0.onUpdate();  //排行榜数据更新
	}


	//点击选择框改变内容
	public chage() {
		this.nDownTime = this.DOWNTIME;

		if (!this.checkBox.selected) {
			this.checkBox.labelDisplay.text = "自动挑战关卡"
		}

		GameGlobal.UserFb.bTianTingAutoFight = this.checkBox.selected
	}

	//更新选择框内容
	public upDataSelectRect() {
		var str = "自动挑战关卡"
		if (this.nDownTime >= this.DOWNTIME || this.nDownTime < 0) {
			str = "自动挑战关卡"
		}
		else {
			str = this.nDownTime + "S后自动挑战关卡"
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
				GameGlobal.UserFb.sendfbJoin(4)
				this.nDownTime = this.nDownTime - 1
			}
			else {

			}
			this.upDataSelectRect()
		}


	}



	public setData() {
		this.tReward = GameGlobal.UserFb.getTianTingRewardList();
		this.tServer = GameGlobal.UserFb.tFbTiantingServerData;
		this.tViewData = GameGlobal.UserFb.getTianTingLvData();

		//初始化奖励内容
		this.tSpReward = [];
		this.nSpLv = -1


		this.tNowLyData = []//当前层级显示数据
		var nMinLy = Math.floor((this.tServer.todayLayer) / 3) * 3 //今天当前关卡
		if (nMinLy < 1) nMinLy = 0


		// firstAward 宝箱内容
		for (const item in this.tViewData) {
			if (this.tViewData[item].uishow) {
				let obj = {lv:this.tViewData[item].id,boss:this.tViewData[item].uishow,caption1:this.tViewData[item].caption1,caption2:this.tViewData[item].caption2}
				this.tSpReward.push(obj)
			}
		}

		for (let i = nMinLy; i <= nMinLy + 3; i++) {
			if (this.tViewData[i]) {
				this.tNowLyData.push(this.tViewData[i])
			}
		}


		this.tBoxObj = []//宝箱奖励列表

		var tBoxList = []

		//宝箱奖励列表
		for (const item in this.tViewData) {
			let pLvData = this.tViewData[item]
			let pRewarBox = { firstAward: [], id: 0 }
			if (pLvData.firstAward && pLvData.firstAward.length > 0) {
				pRewarBox.firstAward = pLvData.firstAward
				pRewarBox.id = pLvData.id
				tBoxList.push(pRewarBox)
			}
		}

		//整理成一个列表
		for (let i = 0; i < tBoxList.length; i++) {
			let nNums = Math.floor(i / 3)
			if (!this.tBoxObj[nNums]) {
				this.tBoxObj[nNums] = []
			}
			this.tBoxObj[nNums].push(tBoxList[i])
		}



	}



	UpdateContent() {
		UIHelper.ShowRedPoint(this.oneKeyBtn, GameGlobal.UserFb.IsTianshilianNotice())

		this.setData()

		for (const item in this.tLayoutItem) {
			this.upDataLyCn(this.tLayoutItem[item], item)
		}

		this.updateRewardItem()


		this.upDateInfo()

		this.showLeftArrow()
		this.showRightArrow()
	}

	//更新奖励内容
	public updateRewardItem() {
		for (const item in this.tRewardItem) {
			this.updateRewardCn(this.tRewardItem[item], item)
		}
	}

	//左边箭头
	public showLeftArrow() {
		if (this.tBoxObj[this.nRewardPage - 1]) {
			this.prevBtn.visible = true
		}
		else {
			this.prevBtn.visible = false
		}
	}

	//右边箭头
	public showRightArrow() {
		if (this.tBoxObj[this.nRewardPage + 1]) {
			this.nextBtn.visible = true
		}
		else {
			this.nextBtn.visible = false
		}
	}

	public upDateInfo() {

		let pData;
		for (const item in this.tSpReward) {
			if(this.tSpReward[item].lv>this.tServer.layer)
			{
				pData = this.tSpReward[item]
				break
			}
		}

		if(pData)
		{
			this.pGroupRewar.visible = true
			this.showReward.SetBody(AppearanceConfig.GetUIPath(pData.boss))
			this.lbPassLvReward.text = pData.caption1
			this.lbReName.text = pData.caption2
		}
		else
		{
			this.pGroupRewar.visible = false
		}



		if (this.tServer.layer > 0) {
			let strPassLv = `|C:0x6E330B&T:最大通关: |C:0x019704&T:${this.tServer.layer}|C:0x6E330B&T: 层|`
			//显示当前最大通关关数
			this.maxLabel.textFlow = TextFlowMaker.generateTextFlow(strPassLv)
		}


		//进度条
		var tBarValue = [0, 5, 10, 15, 22, 35, 50, 65, 78, 85, 90, 95, 100]
		var nStarValue = (this.tServer.layer - this.nRewardPage * 9)
		if (nStarValue > 12)
			nStarValue = 12

		this.bar.value = tBarValue[nStarValue] || 0
		this.bar.labelDisplay.visible = false



	}

	//更新层级内容
	public upDataLyCn(_item, _index) {
		var nNowLv = -1
		for (const item in this.tNowLyData) {
			if (item === _index) {
				nNowLv = this.tNowLyData[item].id
				_item.layerLabel.text = "第" + nNowLv + "层"
				if (this.tNowLyData[item].bossId) {
					_item.showPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(this.tNowLyData[item].bossId)))//boss
				}
			}
		}


		if (nNowLv > 0) {
			if (nNowLv <= this.tServer.todayLayer)//已通关
			{
				_item.arrowImg.visible = false
				_item.goImg.visible = true
			}
			else if (nNowLv === (this.tServer.todayLayer + 1))//当前
			{
				_item.arrowImg.visible = true
				_item.goImg.visible = false

			}
			else if (nNowLv > (this.tServer.todayLayer + 1))//未通关
			{
				_item.goImg.visible = false
				_item.arrowImg.visible = false
			}
		}
		else {
			_item.goImg.visible = false
			_item.arrowImg.visible = false

		}

	}

	//更新奖励内容
	public updateRewardCn(_item, _index) {
		var pRewardData = this.tBoxObj[this.nRewardPage]

		if (pRewardData[_index]) {
			_item.visible = true
			_item.layerLabel.text = pRewardData[_index].id + "层"
			if (this.tServer.layer >= pRewardData[_index].id) {
				_item.stateImg.filters = null
				// if(this.tServer.rewardNo>=pRewardData[_index].id)//已领取
				var bGet = GameGlobal.UserFb.getTiantingStarReward(pRewardData[_index].id)
				if (bGet)//已领取
				{
					_item.redImg.visible = false
					_item.getImg.visible = true
				}
				else //未领取
				{
					_item.redImg.visible = true
					_item.getImg.visible = false
				}
			}
			else {
				_item.stateImg.filters = Color.GetFilter()//变灰
				_item.redImg.visible = false
				_item.getImg.visible = false
			}
		}
		else {
			_item.visible = false

		}
	}

	public OnClose() {

	}

	public onClickRw(e: egret.TouchEvent) {

		var pData;
		switch (e.currentTarget) {
			case this.pItemReward1:
				pData = this.tBoxObj[this.nRewardPage][0];
				break;
			case this.pItemReward2:
				pData = this.tBoxObj[this.nRewardPage][1];
				break;
			case this.pItemReward3:
				pData = this.tBoxObj[this.nRewardPage][2];
				break;
		}

		if (pData) {
			var strIndex = "第" + pData.id + "层"
			this.nReward = pData.id;


			var bGet = GameGlobal.UserFb.getTiantingStarReward(this.nReward)
			var bHaveGet = false
			if (this.tServer.layer >= pData.id && (!bGet)) {
				bHaveGet = true
			}

			WarnWin.showReward(`|C:0x6E330B&T: 通关勇闯天庭|C:0x4fcd4c&T:${strIndex}|C:0x6E330B&T:奖励|`,
				this.getRewrd, this, null, null, "reward", { title: '通关奖励', reward: pData.firstAward, btnName: "领取奖励", bHideSureBtn: !bHaveGet });

		}


	}

	//领取宝箱奖励
	getRewrd() {
		GameGlobal.UserFb.getTianTingReward(this.nReward)
	}



	public onClickLy(e: egret.TouchEvent) {


	}

	public _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.oneKeyBtn:
				if(UserVip.ins().lv<GameGlobal.Config.HeavenFbBaseConfig.viplv)
				{
					UserTips.ins().showTips("Vip"+ GameGlobal.Config.HeavenFbBaseConfig.viplv + "可扫荡")
				}
				else
				{
					if (this.tServer.todayLayer < this.tServer.layer) {
						GameGlobal.UserFb.sendfbSweep(2)
					}
					else {
						UserTips.ins().showTips("无法扫荡")
					}
				}
				break
			case this.challageBtn:
				if (UserFb.FinishAndCheckFighting2()) {
					GameGlobal.UserFb.sendfbJoin(4)
				}
				break
			case this.prevBtn:
				if (this.nRewardPage > 0) {
					this.nRewardPage = this.nRewardPage - 1
				}
				this.updateRewardItem()
				this.showLeftArrow()
				this.showRightArrow()
				this.upDateInfo()
				break
			case this.nextBtn:
				if (this.nRewardPage < this.tBoxObj.length - 1) {
					this.nRewardPage = this.nRewardPage + 1
				}
				this.updateRewardItem()
				this.showLeftArrow()
				this.showRightArrow()
				this.upDateInfo()
				break
		}
	}
}

//层
interface TianshilianPopComp extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// TianshilianPopSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	arrowImg: eui.Image;
	goImg: eui.Image;
	layerLabel: eui.Label;
	showPanel: PetShowPanel;
	/////////////////////////////////////////////////////////////////////////////
}


//奖励
interface TianshilianItem extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// TianshilianItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////


	layerLabel: eui.Label;//阶

	stateImg: eui.Image;//状态
	boxImg: eui.Image;//箱子
	redImg: eui.Image;//红点
	getImg: eui.Image;//获取


	/////////////////////////////////////////////////////////////////////////////
}



