class VipBossPanel extends BaseView implements ICommonWindowTitle {

	public static NAME = "至尊BOSS"

    /////////////////////////////////////////////////////////////////////////////
    // VipBossSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected list: eui.List;
    /////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "VipBossSkin"
		this.list.itemRenderer = VipBossItem
		this.list.dataProvider =  new eui.ArrayCollection([])
	}

	public OnOpen() {
		this.observe(MessageDef.VIP_BOSS_UPDATE, this.UpdateContent)
		GameGlobal.BossModel.sendCallVipBossList()
		this.UpdateContent();
	}

	public OnClose() {
		this.removeObserve();
	}

	public UpdateContent() {
		let list = GameGlobal.BossModel.getVipBossInfo();

		//更新一下开启状态 用于排序
		for (const item in list) {
			list[item].getOpenTime()
			list[item].getLeftTime()
		}

		list.sort(function(a,b){
			if(a.nOpen===b.nOpen)
			{
				return b.nLeftTime - a.nLeftTime
			}
			else
			{
				return b.nOpen - a.nOpen
			}
		});


		let arr = [];
		let i:number;
		let len:number = list.length;
		for( i = 0 ; i < len ;i ++ )
		{
			arr.push(list[i]);
			if (GameGlobal.actorModel.level < list[i].levelLimit)
			{
				break;
			}
		}

		let brr =[]
		let k:number;
		let index:number = list.length;
		for( k = 0 ; k < index ;k ++ )
		{
			brr.push(list[k]);
			if (GameGlobal.actorModel.vipLv < list[k].viplvlimit )
			{
				break;
			}
		}

		list = arr.length > brr.length ? arr:brr;

		(this.list.dataProvider as eui.ArrayCollection).replaceAll(list);
		
	}
}

class VipBossItem extends eui.ItemRenderer {
    /////////////////////////////////////////////////////////////////////////////
    // VipBossItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bossName: eui.Label;
    protected times_txt: eui.Label;
    protected lbMore: eui.Label;
    protected enterInfoLabel: eui.Label;
    protected goBtn: eui.Button;
    protected dieImg: eui.Image;
    protected petShowPanel: PetShowPanel;
    protected list: eui.List;
	protected gProp:eui.Group;
	protected priceIcon: PriceIcon;

	nState = 0; // 0初始值 1银两挑战

    /////////////////////////////////////////////////////////////////////////////

	public childrenCreated() {
		this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.list.itemRenderer = ItemBaseNotName
	}

	private _OnClick() {
		if (!UserFb.FinishAndCheckFighting2()) {
			return
		}


		//银两购买时需要检查
		if(this.nState === 1)
		{
			if (Checker.Money(this.data.costgold.id, this.data.costgold.count))
			{
				GameGlobal.BossModel.sendVipbossChallenge(this.data.id)
			}
		}
		else if(this.nState === 2)
		{
			UserTips.ErrorTip('今天次数已经用完');
		}
		else
		{
			GameGlobal.BossModel.sendVipbossChallenge(this.data.id)
		}


	}

	public dataChanged() {

        let oData = this.data
		if (oData.bossid)
		{
			let monsterCfg = GameGlobal.Config.MonstersConfig[oData.bossid];
			this.bossName.text = monsterCfg[GameGlobal.Config.MonstersConfig_keys.name] //+ "(" +  monsterCfg[GameGlobal.Config.MonstersConfig_keys.level]+"级)"
			this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(oData.bossid)));
		}	
        let nVipLv = UserVip.ins().lv
        let nLeftTime =  (oData.vipCount[nVipLv]||1)
		let mycount =  nLeftTime - oData.daycount;
		if (oData.nOpen) {
			this.goBtn.visible = true
			this.enterInfoLabel.visible = false

			let isDie = false
			if (oData.daycount >= nLeftTime) isDie = true;
			this.dieImg.visible = isDie;
			this.goBtn.visible = !isDie;
			this.gProp.visible = !isDie
			if(!isDie)
			{
				//获取背包中的物品数量
				let nHave =  GameGlobal.UserBag.GetCount(oData.cost.id)
				if(nHave&&nHave>=oData.cost.count)
				{
					this.priceIcon.setPrice(oData.cost.count)
					this.priceIcon.setType(oData.cost.id)
					this.nState = 0
				}
				else
				{
					this.priceIcon.setPrice(oData.costgold.count)
					this.priceIcon.setType(oData.costgold.id)
					this.nState = 1
				}
				let strMore = ""
				if(oData.vipCount[nVipLv+1])
				{
					strMore = "VIP" + (nVipLv+1) +"可再挑战"  + (oData.vipCount[nVipLv+1]  - oData.vipCount[nVipLv]) +"次"
				}
				if (mycount < 1) {
					this.lbMore.text = strMore
				} else {
					this.lbMore.text = ""
				}
				
			}
			else
			{
				this.lbMore.text = ""
			}
			 
			this.goBtn.label = oData.count < oData.needsuccess ? "挑 战" : "扫 荡";
		} else {
			this.goBtn.visible = false
			this.enterInfoLabel.visible = true
			this.enterInfoLabel.text = oData.levelLimit + "级或VIP" + oData.viplvlimit + "可挑战"
			this.dieImg.visible = false;
			this.gProp.visible = false
			this.lbMore.text = ""
		}


		UIHelper.ShowRedPoint(this.goBtn, mycount > 0 && Checker.Money(oData.costgold.id, oData.costgold.count, false))
		this.times_txt.text = "剩余挑战：" + mycount;
		this.list.dataProvider =new eui.ArrayCollection(oData.showItem)
		
	}
}